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
    const queryBuilder = this.departamentosRepository
      .createQueryBuilder('departamento')
      .where({ is_active: true })
      .select([
        'departamento.id',
        'departamento.nombre',
        'departamento.createdAt',
        'departamento.updatedAt',
      ]);

    if (query) {
      queryBuilder.andWhere('departamento.nombre ILIKE :nombre', {
        nombre: `%${query}%`,
      });
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
      where: { id, is_active: true },
    });

    if (!record) {
      Logger.warn(`Departamento #${id} no encontrado`);
      throw new NotFoundException(`Departamento #${id} no encontrado`);
    }

    return record;
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
    return await this.departamentosRepository.remove(departamento);
  }
}
