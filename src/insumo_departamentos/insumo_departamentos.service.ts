import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import InsumoDepartamento from './entities/insumo_departamento.entity';
import CreateInsumoDepartamentoDto from './dtos/create-insumo_departamento.dto';
import UpdateInsumoDepartamentoDto from './dtos/update-insumo_departamento.dto';
import { Query } from 'typeorm/driver/Query';
import QueryIsumoDepartamentoDto from './dtos/query-insumo_departamento.dto';
import Insumo from '../insumos/entities/insumo.entity';
import Departamento from '../departamentos/entities/departamento.entity';

@Injectable()
export class InsumoDepartamentoService {
  constructor(
    @InjectRepository(InsumoDepartamento)
    private readonly insumoDepartamentoRepository: Repository<InsumoDepartamento>,

    @InjectRepository(Insumo)
    private readonly insumoRepository: Repository<Insumo>,

    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
  ) { }

  async findAll(query: QueryIsumoDepartamentoDto) {
    const { q, filter, page, limit } = query;
    const queryBuilder = this.insumoDepartamentoRepository.createQueryBuilder('insumoDepartamento')
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
        'departamento.nombre'
      ]);

    if (q) {
      queryBuilder.andWhere('insumo.nombre LIKE :nombre', { nombre: `%${q}%` });
    }

    if (filter) {
      queryBuilder.andWhere('departamento.nombre = :departamento', { departamento: `${filter}` });
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
    const insumoDepartamento = await this.insumoDepartamentoRepository.findOne({ where: { id, is_active: true } });
    if (!insumoDepartamento) {
      throw new NotFoundException(`InsumoDepartamento con ID ${id} no encontrado o desactivado`);
    }
    return insumoDepartamento;
  }

  async create(createInsumoDepartamentoDto: CreateInsumoDepartamentoDto) {
    const { insumoId, departamentoId, ...rest } = createInsumoDepartamentoDto;

    // Buscar el insumo por su ID
    const insumo = await this.insumoRepository.findOne({ where: { id: insumoId } });
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${insumoId} no encontrado`);
    }

    // Buscar el departamento por su ID
    const departamento = await this.departamentoRepository.findOne({ where: { id: departamentoId } });
    if (!departamento) {
      throw new NotFoundException(`Departamento con ID ${departamentoId} no encontrado`);
    }

    // Crear la relación entre insumo y departamento
    const insumoDepartamento = this.insumoDepartamentoRepository.create({
      ...rest,
      insumo,
      departamento,
    });

    return this.insumoDepartamentoRepository.save(insumoDepartamento);
  }

  async update(id: string, updateInsumoDepartamentoDto: UpdateInsumoDepartamentoDto) {
    const insumoDepartamento = await this.findOne(id);
    if (!insumoDepartamento) {
      throw new NotFoundException(`InsumoDepartamento con ID ${id} no encontrado o desactivado`);
    }
    this.insumoDepartamentoRepository.merge(insumoDepartamento, updateInsumoDepartamentoDto);
    return await this.insumoDepartamentoRepository.save(insumoDepartamento);
  }

  async softDelete(id: string) {
    const insumoDepartamento = await this.findOne(id);
    if (!insumoDepartamento) {
      throw new NotFoundException(`InsumoDepartamento con ID ${id} no encontrado o ya desactivado`);
    }
    // Soft delete: cambia el campo `is_active` a false
    insumoDepartamento.is_active = false;
    return await this.insumoDepartamentoRepository.save(insumoDepartamento);
  }
}
