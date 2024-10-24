import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OrdenLaboratorio from './entities/orden_laboratorio.entity';
import CreateOrdenLaboratorioDto from './dtos/create-orden-laboratorio.dto';
import UpdateOrdenLaboratorioDto from './dtos/update-orden-laboratorio.dto';
import QueryOrdenLaboratorioDto from './dtos/query-orden-laboratorio.dto';
import User from '../users/entities/user.entity';
import Paciente from '../pacientes/entities/paciente.entity';
import Examen from '../examenes/entities/examen.entity';
import Retiro from '../retiros/entities/retiro.entity';
import InsumoExamen from 'src/insumo_examenes/entities/insumo_examen.entity';
import { InsumoExamenesService } from 'src/insumo_examenes/insumo_examenes.service';
import { RetirosService } from 'src/retiros/retiros.service';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import CreateRetiroDto from 'src/retiros/dto/create-retiro.dto';
import { DetalleRetiroDto } from 'src/retiros/dto/create-retiro.dto';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import { log } from 'console';
import { EstadoOrdenLaboratorio } from './enum/estado-orden-laboratorio.enum';

@Injectable()
export class OrdenLaboratoriosService {
  constructor(
    @InjectRepository(OrdenLaboratorio)
    private readonly ordenLaboratorioRepository: Repository<OrdenLaboratorio>,

    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,

    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,

    @InjectRepository(Examen)
    private readonly examenRepository: Repository<Examen>,

    @InjectRepository(Retiro)
    private readonly retiroRepository: Repository<Retiro>,

    @InjectRepository(InsumoDepartamento)
    private readonly insumoDepartamentoRepository: Repository<InsumoDepartamento>,

    private readonly insumoExamenService: InsumoExamenesService,

    private readonly retiroService: RetirosService,

    private readonly departamentoService: DepartamentosService,
  ) {}

  // Método para crear una nueva orden de laboratorio
  async create(createOrdenLaboratorioDto: CreateOrdenLaboratorioDto) {
    const { usuarioId, retiroId, pacienteId, examenId, ...rest } =
      createOrdenLaboratorioDto;

    // Verifica que el usuario existe
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    // Verifica que el paciente existe
    const paciente = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
    });
    if (!paciente) {
      throw new NotFoundException(
        `Paciente con ID ${pacienteId} no encontrado`,
      );
    }

    // Verifica que el examen existe
    const examen = await this.examenRepository.findOne({
      where: { id: examenId },
    });
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${examenId} no encontrado`);
    }

    // Verifica si se proporcionó un ID de retiro y busca el retiro (es opcional)
    let retiro: Retiro | null = null;
    if (retiroId) {
      retiro = await this.retiroRepository.findOne({ where: { id: retiroId } });
    }

    // Crear la nueva orden de laboratorio
    const ordenLaboratorio = this.ordenLaboratorioRepository.create({
      ...rest,
      usuario,
      paciente,
      examen,
      retiro,
    });

    // Guarda y retorna la nueva orden
    return this.ordenLaboratorioRepository.save(ordenLaboratorio);
  }

  // Método para obtener todas las órdenes de laboratorio (con filtros opcionales)
  async findAll(query: QueryOrdenLaboratorioDto) {
    const { q, filter, page, limit } = query;
    const queryBuilder = this.ordenLaboratorioRepository
      .createQueryBuilder('ordenLaboratorio')
      .where({ is_active: true })
      .leftJoinAndSelect('ordenLaboratorio.usuario', 'usuario')
      .leftJoinAndSelect('ordenLaboratorio.paciente', 'paciente')
      .leftJoinAndSelect('ordenLaboratorio.examen', 'examen')
      .leftJoinAndSelect('ordenLaboratorio.retiro', 'retiro');

    // Aplicar filtro de búsqueda (si se proporciona)
    if (q) {
      queryBuilder.andWhere('paciente.nombre ILIKE :nombre', {
        nombre: `%${q}%`,
      });
    }

    // Aplicar filtro por estado (si se proporciona)
    if (filter) {
      queryBuilder.andWhere('ordenLaboratorio.estado = :estado', {
        estado: filter,
      });
    }

    const totalItems = await queryBuilder.getCount();
    const ordenesLaboratorio = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: ordenesLaboratorio,
      totalItems,
      totalPages,
      page,
    };
  }

  // Método para obtener una única orden de laboratorio por ID
  async findOne(id: string) {
    const ordenLaboratorio = await this.ordenLaboratorioRepository.findOne({
      where: { id, is_active: true },
      relations: ['usuario', 'paciente', 'examen', 'retiro'],
    });

    if (!ordenLaboratorio) {
      throw new NotFoundException(
        `Orden de laboratorio con ID ${id} no encontrada`,
      );
    }

    return ordenLaboratorio;
  }

  // Método para actualizar una orden de laboratorio
  async update(
    id: string,
    updateOrdenLaboratorioDto: UpdateOrdenLaboratorioDto,
  ) {
    const ordenLaboratorio = await this.findOne(id);

    // Actualiza los campos de la orden de laboratorio
    this.ordenLaboratorioRepository.merge(
      ordenLaboratorio,
      updateOrdenLaboratorioDto,
    );

    return this.ordenLaboratorioRepository.save(ordenLaboratorio);
  }

  // Método para eliminar (soft delete) una orden de laboratorio
  async softDelete(id: string) {
    const ordenLaboratorio = await this.findOne(id);

    if (ordenLaboratorio.estado === EstadoOrdenLaboratorio.ENTREGADO) {
      throw new BadRequestException('No se puede eliminar una orden entregada');
    }
    // Soft delete: Cambia el campo `is_active` a false
    ordenLaboratorio.is_active = false;

    return this.ordenLaboratorioRepository.save(ordenLaboratorio);
  }

  // Método para crear una nueva orden de laboratorio segun examenes
  async createByExams(createOrdenLaboratorioDto: CreateOrdenLaboratorioDto) {
    const { usuarioId, retiroId, pacienteId, examenId, ...rest } =
      createOrdenLaboratorioDto;

    // Verifica que el usuario existe
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    // Verifica que el paciente existe
    const paciente = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
    });
    if (!paciente) {
      throw new NotFoundException(
        `Paciente con ID ${pacienteId} no encontrado`,
      );
    }

    const laboratorio =
      await this.departamentoService.findOneByName('Laboratorio');
    if (!laboratorio) {
      throw new NotFoundException(
        `Departamento con nombre Laboratorio no encontrado`,
      );
    }

    // Verifica que el examen existe
    const examen = await this.examenRepository.findOne({
      where: { id: examenId },
    });
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${examenId} no encontrado`);
    }

    const insumosExamen = (
      await this.insumoExamenService.findAll({ examenId: examenId })
    ).data;

    const insumosPromise = insumosExamen.map(async (element) => {
      const { insumo, cantidad } = element;

      const insumoDeparamento = await this.insumoDepartamentoRepository.findOne(
        {
          where: {
            insumo,
            departamento: { id: laboratorio.id, nombre: laboratorio.nombre },
            is_active: true,
          },
        },
      );

      if (!insumoDeparamento) {
        throw new NotFoundException(
          `Insumo ${insumo.nombre} no encontrado en el departamento`,
        );
      }

      const result: DetalleRetiroDto = {
        insumoDepartamentoId: insumoDeparamento.id,
        cantidad: cantidad,
      };

      return result;
    });

    const insumosArray: DetalleRetiroDto[] = await Promise.all(insumosPromise);

    const retiroPromise: CreateRetiroDto = {
      usuarioId: usuario.id,
      descripcion: `Orden de laboratorio para el paciente ${paciente.nombre}`,
      detalles: insumosArray,
    };

    const retiroP = this.retiroService.create(retiroPromise);

    if (!retiroP) {
      throw new NotFoundException(`No se pudo crear el retiro`);
    }

    const { retiro } = await Promise.resolve(retiroP);
    // this.retiroService.create(retiroPromise);
    const nuevaOrdenLaboratorio: CreateOrdenLaboratorioDto = {
      usuarioId: usuario.id,
      pacienteId: paciente.id,
      examenId: examen.id,
      retiroId: retiro.id,
      ...rest,
    };
    // Crear la nueva orden de laboratorio
    return this.create(nuevaOrdenLaboratorio);
  }
}
