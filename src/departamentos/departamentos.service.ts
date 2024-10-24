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
      queryBuilder.andWhere('departamento.nombre ILIKE :nombre', {
        nombre: `%${q}%`,
      });
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

  async findOneWithDepartamentos(departamentoId: string) {
    if (!isUUID(departamentoId)) {
      throw new BadRequestException('ID de departamento inválido');
    }

    const departamento = await this.departamentosRepository.findOne({
      where: { id: departamentoId, is_active: true },
      relations: ['insumosDepartamentos', 'insumosDepartamentos.insumo'],
    });

    if (!departamento) {
      throw new NotFoundException(
        `Departamento con ID ${departamentoId} no encontrado`,
      );
    }

    const insumos = departamento.insumosDepartamentos.map(
      (insumoDepartamento) => ({
        id: insumoDepartamento.insumo.id,
        codigo: insumoDepartamento.insumo.codigo,
        nombre: insumoDepartamento.insumo.nombre,
        existencia: insumoDepartamento.existencia,
      }),
    );

    return {
      departamento: {
        id: departamento.id,
        nombre: departamento.nombre,
      },
      insumos,
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
    return await this.departamentosRepository.remove(departamento);
  }
}
