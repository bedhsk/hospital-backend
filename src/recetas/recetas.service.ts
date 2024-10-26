import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import CreateRecetaDto from './dto/create-receta.dto';
import UpdateRecetaDto from './dto/update-receta.dto';
import Receta from './entities/receta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PacientesService } from 'src/pacientes/pacientes.service';
import QueryRecetaDto from './dto/query-receta.dto';
import { EstadoReceta } from './enum/estado-receta.enum';
import { DetalleretirosService } from '../retiros/detalleretiros/detalleretiros.service'
import { RetirosService } from '../retiros/retiros.service';
import { InsumoDepartamentosService } from '../insumo_departamentos/insumo_departamentos.service';

@Injectable()
export class RecetasService {
  constructor(
    @InjectRepository(Receta)
    private recetasRepository: Repository<Receta>,
    private readonly usersService: UsersService,
    private readonly pacientesService: PacientesService,
    private readonly detalleRetiroService: DetalleretirosService,
    private readonly retiroService: RetirosService,
    private readonly insumoDepartamentoService: InsumoDepartamentosService
  ) {}

  async create(createRecetaDto: CreateRecetaDto): Promise<Receta> {
    const { userId, pacienteId, descripcion, detalles, ...recetaData } = createRecetaDto;

    // Validar existencia de user y paciente
    const user = await this.usersService.findOne(userId);
    const paciente = await this.pacientesService.findOne(pacienteId);
    if (!user) throw new NotFoundException('User not found, cannot create receta');
    if (!paciente) throw new NotFoundException('Paciente not found, cannot create receta');

    // Crear la receta
    const receta = this.recetasRepository.create({
      ...recetaData,
      descripcion,
      user: { id: user.id },
      paciente: { id: paciente.id },
    });
    const savedReceta = await this.recetasRepository.save(receta);

    // Procesar y generar los detalles de retiro
    const retiroDetalles = [];
    const retiro = await this.retiroService.create({
      usuarioId: user.id,
      descripcion: descripcion,
      detalles: retiroDetalles,
    });

    for (const detalle of detalles) {
      const { insumoId, departamentoId, cantidad } = detalle;

      // Buscar insumo-departamento por insumoId y departamentoId
      const insumoDepartamento = await this.insumoDepartamentoService.findOneByInsumoAndDepartamento(
        insumoId, departamentoId, true // true asume que este es el departamento destino
      );

      if (!insumoDepartamento) {
        throw new NotFoundException(`Insumo ${insumoId} en departamento ${departamentoId} no encontrado`);
      }

      // Crear el detalle de retiro y añadirlo a retiroDetalles
      const detalleRetiro = await this.detalleRetiroService.create({
        retiroId: retiro.retiro.id, // Cambiar a utilizar el ID del retiro creado
        insumoDepartamentoId: insumoDepartamento.id,
        cantidad,
      });

      retiroDetalles.push(detalleRetiro);
    }

    // Retornar solo la información necesaria de la receta
    return {
      id: savedReceta.id,
      descripcion: savedReceta.descripcion,
      createdAt: savedReceta.createdAt,
      user: { id: user.id, name: user.name },
      paciente: { id: paciente.id, nombre: paciente.nombre },
    } as Receta;
}



  async findAll(query: QueryRecetaDto) {
    const { q, filter, page = 1, limit = 10 } = query;
    const queryBuilder = this.recetasRepository
      .createQueryBuilder('receta')
      .leftJoinAndSelect('receta.user', 'user')
      .leftJoinAndSelect('receta.paciente', 'paciente')
      .where('receta.is_Active = :isActive', { isActive: true });

    if (q) {
      queryBuilder.andWhere(
        '(user.name ILIKE :name OR paciente.nombre ILIKE :nombre OR paciente.cui ILIKE :cui)',
        { name: `%${q}%`, nombre: `%${q}%`, cui: `%${q}%` },
      );
    }

    if (filter) {
      queryBuilder.andWhere(
        '(user.name = :user OR paciente.nombre = :paciente)',
        { user: filter, paciente: filter },
      );
    }

    const totalItems = await queryBuilder.getCount();

    const recetas = await queryBuilder
      .select([
        'receta.id',
        'receta.descripcion',
        'receta.createdAt',
        'receta.estado', // Incluir el campo estado
        'user.id',
        'user.name',
        'paciente.id',
        'paciente.nombre',
      ])
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: recetas,
      totalItems,
      totalPages,
      page,
    };
  }

  async findOne(id: string) {
    const record = await this.recetasRepository.findOne({
      where: { id, is_Active: true },
      relations: ['user', 'paciente'],
      select: ['id', 'descripcion', 'createdAt', 'estado'], // Incluir el campo estado
    });

    if (!record) {
      throw new NotFoundException(`Receta #${id} no encontrada`);
    }
    return record;
  }

  async update(id: string, updateRecetaDto: UpdateRecetaDto) {
    const receta = await this.findOne(id);
    const { userId, pacienteId, ...recetaData } = updateRecetaDto;

    // Verificar si se envió un roleId y actualizar solo si se envía
    if (userId) {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException('Role not found, cannot update receta');
      }
      receta.user = user;
    }

    if (pacienteId) {
      const paciente = await this.pacientesService.findOne(pacienteId);
      if (!paciente) {
        throw new NotFoundException('Paciente not found, cannot update receta');
      }
      receta.paciente = paciente;
    }

    // Mergear los otros datos de la receta
    this.recetasRepository.merge(receta, recetaData);

    return this.recetasRepository.save(receta);
  }

  async remove(id: string) {
    const receta = await this.findOne(id);

    // Verificar si el estado es 'Entregado'
    if (receta.estado === EstadoReceta.ENTREGADO) {
      throw new BadRequestException(
        'No se puede eliminar una receta con estado "Entregado".',
      );
    }

    // Realizar el soft delete (cambiar is_Active a false)
    receta.is_Active = false;
    await this.recetasRepository.save(receta);
  }
}
