import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Examen from './entities/examen.entity';
import CreateExamenDto from './dtos/create-examen.dto';
import UpdateExamenDto from './dtos/update-examen.dto';
import QueryExamenDto from './dtos/query-examen.dto';

@Injectable()
export class ExamenesService {
  constructor(
    @InjectRepository(Examen)
    private readonly examenesRepository: Repository<Examen>,
  ) {}

  // Crear un nuevo examen
  async create(createExamenDto: CreateExamenDto) {
    const examen = this.examenesRepository.create(createExamenDto);
    return this.examenesRepository.save(examen);
  }

  // Obtener todos los exámenes con Soft Delete (solo los que estén activos)
  async findAll(query: QueryExamenDto) {
    const { nombre, page = 1, limit = 10 } = query;

    const queryBuilder = this.examenesRepository.createQueryBuilder('examen')
      .where('examen.is_active = :isActive', { isActive: true }); // Solo exámenes activos

    if (nombre) {
      queryBuilder.andWhere('examen.nombre LIKE :nombre', { nombre: `%${nombre}%` });
    }

    const [result, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: result,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  // Buscar un examen por su ID
  async findOne(id: string) {
    const examen = await this.examenesRepository.findOne({ where: { id, is_active: true } }); // Solo exámenes activos
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado o desactivado`);
    }
    return examen;
  }

  // Actualizar un examen
  async update(id: string, updateExamenDto: UpdateExamenDto) {
    const examen = await this.findOne(id); // Validamos que el examen existe y está activo

    // Si el examen no existe o está inactivo, findOne arroja NotFoundException
    this.examenesRepository.merge(examen, updateExamenDto);
    return this.examenesRepository.save(examen);
  }

  // Soft delete para un examen (solo cambia el campo is_active a false)
  async softDelete(id: string) {
    const examen = await this.findOne(id); // Validamos que el examen existe y está activo

    // Cambiamos el estado a inactivo en lugar de eliminar el registro físicamente
    examen.is_active = false;
    return this.examenesRepository.save(examen);
  }
}
