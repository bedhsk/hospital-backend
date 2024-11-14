import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInsumoDepartamentoDto } from './dto/create-insumo_departamento.dto';
import UpdateInsumoDepartamentoDto from './dto/update-insumo_departamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InsumosService } from 'src/insumos/insumos.service';
import { Repository } from 'typeorm';
import QueryIsumoDepartamentoDto from './dto/query-insumo_departamento.dto';
import { InsumoDepartamento } from './entities/insumo_departamento.entity';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import { log } from 'console';
import { OnEvent } from '@nestjs/event-emitter';
import { DepartmentDeletedEvent } from 'src/events/department-deleted.event';

@Injectable()
export class InsumoDepartamentosService {
  constructor(
    @InjectRepository(InsumoDepartamento)
    private readonly insumodepartamentoService: Repository<InsumoDepartamento>,
    private readonly departamentoService: DepartamentosService,
    @Inject(forwardRef(() => InsumosService))
    private readonly insumoService: InsumosService,
  ) {}

  async findAll(query: QueryIsumoDepartamentoDto) {
    const { q, filter, page, limit } = query;
    const queryBuilder = this.insumodepartamentoService
      .createQueryBuilder('insumoDepartamento')
      .where({ is_active: true })
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo')
      .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
      .select([
        'insumoDepartamento.id',
        'insumoDepartamento.existencia',
        'insumoDepartamento.insumoId',
        'insumoDepartamento.departamentoId',
        'insumo.id',
        'insumo.nombre',
        'departamento.id',
        'departamento.nombre',
      ]);

    if (q) {
      queryBuilder.andWhere("unaccent(insumo.nombre) ILIKE unaccent(:nombre)", { nombre: `%${q}%` });
    }

    if (filter) {
      queryBuilder.andWhere("unaccent(departamento.nombre) = unaccent(:departamento)", {
        departamento: `${filter}`,
      });
    }

    const totalItems = await queryBuilder.getCount();
    const insumoDepartamentos = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: insumoDepartamentos,
      totalItems,
      totalPages,
      page,
    };
  }

  async findOne(id: string) {
    const insumoDepartamento = await this.insumodepartamentoService.findOne({
      where: { id, is_active: true },
      relations: ['insumo', 'departamento'],
    });
    if (!insumoDepartamento) {
      throw new NotFoundException(
        `InsumoDepartamento con ID ${id} no encontrado o desactivado`,
      );
    }
    return insumoDepartamento;
  }

  async findOneByInsumoAndDepartamento(
    insumoId: string,
    departamentoId: string,
  ) {
    const insumoDepartamento = await this.insumodepartamentoService.findOne({
      where: {
        insumo: { id: insumoId },
        departamento: { id: departamentoId },
        is_active: true,
      },
      relations: ['insumo', 'departamento'],
    });
    log('findOneByInsumoAndDepto: ', insumoDepartamento);
    return insumoDepartamento;
  }

  async create(createInsumoDepartamentoDto: CreateInsumoDepartamentoDto) {
    const { insumoId, departamentoId, ...rest } = createInsumoDepartamentoDto;
    const insumo = await this.insumoService.findOne(
      createInsumoDepartamentoDto.insumoId,
    );
    const departamento = await this.departamentoService.findOne(
      createInsumoDepartamentoDto.departamentoId,
    );

    if (!insumo) {
      throw new NotFoundException(`Insumo con id ${insumoId} no encontrado`);
    }

    if (!departamento) {
      throw new NotFoundException(
        `Departamento con id ${departamentoId} no encontrado`,
      );
    }

    // Crear la relación entre insumo y departamento
    const insumoDepartamento = this.insumodepartamentoService.create({
      ...rest,
      insumo,
      departamento,
    });

    return this.insumodepartamentoService.save(insumoDepartamento);
  }

  async update(
    id: string,
    updateInsumoDepartamentoDto: UpdateInsumoDepartamentoDto,
  ) {
    const insumoDepartamento = await this.findOne(id);
    if (!insumoDepartamento) {
      throw new NotFoundException(
        `InsumoDepartamento con ID ${id} no encontrado o desactivado`,
      );
    }
    this.insumodepartamentoService.merge(
      insumoDepartamento,
      updateInsumoDepartamentoDto,
    );
    return await this.insumodepartamentoService.save(insumoDepartamento);
  }

  async Remove(id: string) {
    const insumoDepartamento = await this.findOne(id);
    if (!insumoDepartamento) {
      throw new NotFoundException(
        `InsumoDepartamento con ID ${id} no encontrado o ya desactivado`,
      );
    }
    // Soft delete: cambia el campo `is_active` a false
    insumoDepartamento.is_active = false;
    return await this.insumodepartamentoService.save(insumoDepartamento);
  }

  async findByInsumoDepartamentoId(insumoId: string, departamentoId: string) {
    const departamento = await this.departamentoService.findOne(departamentoId);
    if (!departamento) {
      throw new NotFoundException(
        `Departamento con ID ${departamentoId} no encontrado`,
      );
    }
    const insumo = await this.insumoService.findOne(insumoId);
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${insumoId} no encontrado`);
    }
    const insumoDepartamento = await this.insumodepartamentoService.findOne({
      where: {
        insumo: {
          id: insumo.id,
          nombre: insumo.nombre,
          trazador: insumo.trazador,
        },
        departamento: { id: departamento.id, nombre: departamento.nombre },
        is_active: true,
      },
      relations: ['insumo', 'departamento'],
    });
    if (!insumoDepartamento) {
      throw new NotFoundException(
        `InsumoDepartamento con insumo ID ${insumoId} y departamento ID ${departamentoId} no encontrado`,
      );
    }
    return insumoDepartamento;
  }

  async getStock(insumoId: string) {
    const result = await this.insumodepartamentoService
      .createQueryBuilder('insumo_departamento')
      .select('SUM(insumo_departamento.existencia)', 'total')
      .where('insumo_departamento.insumoId = :insumoId', { insumoId })
      .andWhere('insumo_departamento.is_active = :isActive', { isActive: true })
      .getRawOne();

    return result;
  }

  @OnEvent('department.deleted')
  async handleDepartmentDeleted(event: DepartmentDeletedEvent) {
    const departamento = event.departamento;
    const insumoDepartamentos = await this.insumodepartamentoService.find({
      where: {
        departamento: { id: departamento.id, nombre: departamento.nombre },
        is_active: true,
      },
      relations: ['insumo', 'departamento'],
    });
    for (const insumoDepartamento of insumoDepartamentos) {
      await this.Remove(insumoDepartamento.id);
    }
  }
}
