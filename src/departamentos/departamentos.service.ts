import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import Departamento from './entities/departamento.entity';
import CreateDepartamentoDto from './dto/create-departamento.dto';
import UpdateDepartamentoDto from './dto/update-departamento.dto';
import QueryDepartamentoDto from './dto/query-departamento.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DepartmentDeletedEvent } from 'src/events/department-deleted.event';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private readonly departamentosRepository: Repository<Departamento>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  create(createDepartamentoDto: CreateDepartamentoDto): Promise<Departamento> {
    const record = this.departamentosRepository.create(createDepartamentoDto);
    return this.departamentosRepository.save(record);
  }

  async findAll(queryDto: QueryDepartamentoDto) {
    const { q, filter, page = 1, limit = 10 } = queryDto;

    const queryBuilder = this.departamentosRepository
      .createQueryBuilder('departamento')
      .leftJoinAndSelect(
        'departamento.insumosDepartamentos',
        'insumoDepartamento',
      )
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo')
      .where('departamento.is_active = :isActive', { isActive: true });

    if (q) {
      queryBuilder.andWhere(
        'unaccent(departamento.nombre) ILIKE unaccent(:nombre)',
        {
          nombre: `%${q}%`,
        },
      );
    }

    const totalItems = await queryBuilder.getCount();

    const departamentos = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const departamentosConInsumos = departamentos.map((departamento) => {
      const insumosUnicos = new Map();
      departamento.insumosDepartamentos.forEach((insumoDepartamento) => {
        if (insumoDepartamento.insumo) {
          insumosUnicos.set(insumoDepartamento.insumo.id, {
            id: insumoDepartamento.insumo.id,
            codigo: insumoDepartamento.insumo.codigo,
            nombre: insumoDepartamento.insumo.nombre,
            existencia: insumoDepartamento.existencia,
          });
        }
      });

      return {
        id: departamento.id,
        nombre: departamento.nombre,
        createdAt: departamento.createdAt,
        updatedAt: departamento.updatedAt,
        insumos: Array.from(insumosUnicos.values()),
      };
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: departamentosConInsumos,
      totalItems,
      totalPages,
      page,
    };
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('ID inválido');
    }

    const record = await this.departamentosRepository.findOne({
      where: { id, is_active: true },
    });

    if (!record) {
      Logger.warn(`Departamento #${id} no encontrado`);
      throw new NotFoundException(`Departamento #${id} no encontrado`);
    }

    return record;
  }
  async findOneWithDepartamentos(id: string, queryDto: QueryDepartamentoDto) {
    const { q, filter, page = 1, limit = 10 } = queryDto;

    if (!isUUID(id)) {
      throw new BadRequestException('ID inválido');
    }

    // Obtener el departamento con sus insumos relacionados
    const departamento = await this.departamentosRepository
      .createQueryBuilder('departamento')
      .leftJoinAndSelect(
        'departamento.insumosDepartamentos',
        'insumoDepartamento',
      )
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo')
      .where('departamento.id = :id', { id })
      .andWhere('departamento.is_active = :isActive', { isActive: true })
      .getOne();

    if (!departamento) {
      Logger.warn(`Departamento #${id} no encontrado`);
      throw new NotFoundException(`Departamento #${id} no encontrado`);
    }

    // Procesar insumos
    const insumos = departamento.insumosDepartamentos.map(
      (insumoDepartamento) => ({
        id: insumoDepartamento.insumo.id,
        codigo: insumoDepartamento.insumo.codigo,
        nombre: insumoDepartamento.insumo.nombre,
        existencia: insumoDepartamento.existencia,
      }),
    );

    const totalItems = insumos.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Aplicar paginación
    const paginatedInsumos = insumos.slice((page - 1) * limit, page * limit);

    // Estructura de respuesta
    return {
      id: departamento.id,
      nombre: departamento.nombre,
      insumos: paginatedInsumos,
      totalItems,
      totalPages,
      page,
    };
  }

  async findOneByName(nombre: string) {
    const record = await this.departamentosRepository.findOne({
      where: { nombre, is_active: true },
    });

    if (!record) {
      Logger.warn(`Departamento ${nombre} no encontrado`);
      throw new NotFoundException(`Departamento ${nombre} no encontrado`);
    }

    return record;
  }

  async update(id: string, updateDepartamentoDto: UpdateDepartamentoDto) {
    const departamento = await this.findOne(id);
    this.departamentosRepository.merge(departamento, updateDepartamentoDto);
    return await this.departamentosRepository.save(departamento);
  }

  async remove(id: string) {
    const departamento = await this.findOne(id);

    // Validar si el departamento existe
    if (!departamento) {
      throw new NotFoundException(`Departamento con ID ${id} no encontrado`);
    }

    this.eventEmitter.emit(
      'department.deleted',
      new DepartmentDeletedEvent(id, departamento),
    );

    departamento.is_active = false;
    await this.departamentosRepository.save(departamento);

    return { message: 'Departamento eliminado con éxito' };
  }
}
