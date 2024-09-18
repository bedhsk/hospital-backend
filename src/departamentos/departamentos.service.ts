import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import CreateDepartamentoDto from './dto/create-departamento.dto';
import UpdateDepartamentoDto from './dto/update-departamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Departamento from './entities/departamento.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import QueryDepartamentoDto from './dto/query-departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private readonly departamentosRepository: Repository<Departamento>,
  ) {}

  create(createDepartamentoDto: CreateDepartamentoDto): Promise<Departamento> {
    const record = this.departamentosRepository.create(createDepartamentoDto);
    return this.departamentosRepository.save(record);
  }

  async findAll(queryDto: QueryDepartamentoDto) {
    const { query, filter, page, limit } = queryDto;
    const queryBuilder = this.departamentosRepository.createQueryBuilder('departamento')
      .where({ is_Active: true })
      .select([
        'departamento.id',
        'departamento.nombre',
        'departamento.createdAt',
        'departamento.updatedAt',
      ]);

    if (query) {
      queryBuilder.andWhere('departamento.nombre LIKE :nombre', { nombre: `%${query}%` });
    }

    const totalItems = await queryBuilder.getCount();

    const departamentos = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      data: departamentos,
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
      where: { id, is_Active: true },
    });

    if (!record) {
      Logger.warn(`Departamento #${id} no encontrado`);
      throw new NotFoundException(`Departamento #${id} no encontrado`);
    }

    return record;
  }

  async update(id: string, updateDepartamentoDto: UpdateDepartamentoDto) {
    const depto = await this.findOne(id);
    this.departamentosRepository.merge(depto, updateDepartamentoDto);
    return this.departamentosRepository.save(depto);
  }

  async remove(id: string) {
    const depto = await this.findOne(id);
    depto.is_Active = false;
    await this.departamentosRepository.save(depto);
    return 'Departamento desactivado exitosamente';
  }
}
