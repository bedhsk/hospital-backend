import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OrdenLaboratorio from './entities/orden_laboratorio.entity';
import CreateOrdenLaboratorioDto from './dtos/create-orden-laboratorio.dto';
import UpdateOrdenLaboratorioDto from './dtos/update-orden-laboratorio.dto';
import QueryOrdenLaboratorioDto from './dtos/query-orden-laboratorio.dto';
import User from '../users/entities/user.entity';
import Paciente from '../pacientes/entities/paciente.entity';
import Examen from '../examenes/entities/examen.entity';
import { InsumoExamenesService } from 'src/insumo_examenes/insumo_examenes.service';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import { EstadoOrdenLaboratorio } from './enum/estado-orden-laboratorio.enum';
import Retiro from 'src/retiros/entities/retiro.entity';
import { RetirosService } from 'src/retiros/retiros.service';
import CreateRetiroDto, {
  DetalleRetiroDto,
} from 'src/retiros/dto/create-retiro.dto';
import CreateRetiroExamenDto from 'src/retiros/dto/create-retiro-examen.dto';
import RetireOrdenDto from './dtos/retire-orden-laboratorio.dto';
import { UsersService } from 'src/users/users.service';

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

    private readonly userService: UsersService,
  ) {}

  // Método para crear una nueva orden de laboratorio
  async create(createOrdenLaboratorioDto: CreateOrdenLaboratorioDto) {
    const { usuarioId, retiroId, pacienteId, examenId, estado, ...rest } =
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
      estado
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
      .leftJoinAndSelect('examen.insumoExamenes', 'insumoExamenes')
      .leftJoinAndSelect('insumoExamenes.insumo', 'insumo')
      .leftJoinAndSelect('insumo.categoria', 'categoria')
      .leftJoinAndSelect('ordenLaboratorio.retiro', 'retiro')
      .leftJoinAndSelect('retiro.detalleRetiro', 'detalleRetiro')
      .leftJoinAndSelect('detalleRetiro.insumoDepartamento', 'insumoDepartamento')
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo2')
      .leftJoinAndSelect('insumo2.categoria', 'categoria2')
      .orderBy('ordenLaboratorio.created_at', 'DESC');

    // Aplicar filtro de búsqueda (si se proporciona)
    if (q) {
      queryBuilder.andWhere(
        'ordenLaboratorio.usuario ILIKE :usuario OR ordenLaboratorio.examen ILIKE :examen',
        { usuario: `%${q}%`, examen: `%${q}%` },
      );
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
    const newOrdenes = ordenesLaboratorio.map((orden) => {
      let retiros = [];
      if (orden.retiro) {
        retiros = orden.retiro.detalleRetiro.map((detalle) => {
          return {
            id: detalle.id,
            insumo: detalle.insumoDepartamento.insumo.nombre,
            cantidad: detalle.cantidad,
            categoria: {
              id: detalle.insumoDepartamento.insumo.categoria.id,
              nombre: detalle.insumoDepartamento.insumo.categoria.nombre,
            }
          };
        });
      }
      return {
        id: orden.id,
        estado: orden.estado,
        createdAt: orden.created_at,
        updatedAt: orden.updated_at,
        usuario: {id: orden.usuario.id, nombre: orden.usuario.name},
        paciente: {id: orden.paciente.id, nombre: orden.paciente.nombre},
        examen: orden.examen,
        insumosRetirados: retiros
      }
    });
    return {
      data: newOrdenes,
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
    const { usuarioId, retiroId, pacienteId, examenId, estado, ...rest } =
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

    let nuevaOrdenLaboratorio: CreateOrdenLaboratorioDto;

    if (estado === EstadoOrdenLaboratorio.ENTREGADO) {
      // Crear un nuevo retiro
      const nuevoRetiro: CreateRetiroExamenDto = {
        usuarioId: usuario.id,
        departamentoId: laboratorio.id,
        descripcion: 'Retiro por orden de laboratorio para el paciente:' + paciente.nombre,
        examenId: examen.id,
      }

      const retiroCompleto = await this.retiroService.createByExams(nuevoRetiro);

      nuevaOrdenLaboratorio = {
        usuarioId: usuario.id,
        pacienteId: paciente.id,
        examenId: examen.id,
        retiroId: retiroCompleto.retiro.id,
        estado: estado,
        ...rest,
      };
    }

    else {
      nuevaOrdenLaboratorio = {
        usuarioId: usuario.id,
        pacienteId: paciente.id,
        examenId: examen.id,
        retiroId: null,
        estado: estado,
        ...rest,
      };
    }
    // Crear la nueva orden de laboratorio
    return this.create(nuevaOrdenLaboratorio);
  }

  async retireOrderLaboratorio(id: string, usuario: RetireOrdenDto) {
    const ordenLaboratorio = await this.findOne(id);
    if (!ordenLaboratorio) {
      throw new NotFoundException(
        `Orden de laboratorio con ID ${id} no encontrada`,
      );
    }
    if (ordenLaboratorio.estado === EstadoOrdenLaboratorio.ENTREGADO) {
      throw new BadRequestException('La orden ya fue entregada');
    }
    else{
      const laboratorio = await this.departamentoService.findOneByName('Laboratorio');
      if (!laboratorio) {
        throw new NotFoundException(
          `Departamento con nombre Laboratorio no encontrado`,
        );
      }
      const user = await this.userService.findOne(usuario.userId);
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${usuario.userId} no encontrado`);
      }
      const retiro = await this.retiroService.createByExams({
        usuarioId: user.id,
        departamentoId: laboratorio.id,
        descripcion: 'Retiro por orden de laboratorio para el paciente:' + ordenLaboratorio.paciente.nombre,
        examenId: ordenLaboratorio.examen.id,
      })
      ordenLaboratorio.estado = EstadoOrdenLaboratorio.ENTREGADO;
      ordenLaboratorio.retiro = retiro.retiro;
      return this.ordenLaboratorioRepository.save(ordenLaboratorio);
    }
  }
}
