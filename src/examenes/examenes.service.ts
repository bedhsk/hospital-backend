import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Examen from './entities/examen.entity';
import CreateExamenDto from './dtos/create-examen.dto';
import UpdateExamenDto from './dtos/update-examen.dto';
import QueryExamenDto from './dtos/query-examen.dto';
import InsumoExamen from 'src/insumo_examenes/entities/insumo_examen.entity';


@Injectable()
export class ExamenesService {
  constructor(
    @InjectRepository(Examen)
    private readonly examenesRepository: Repository<Examen>,

    @InjectRepository(InsumoExamen)
    private readonly insumoExamenRepository: Repository<InsumoExamen>, // Repositorio para la relación
  ) {}

  // Crear un nuevo examen con relación a insumos
  async create(createExamenDto: CreateExamenDto) {
    const { nombre, descripcion, insumos } = createExamenDto;
    
    // Crear el examen
    const examen = this.examenesRepository.create({ nombre, descripcion });
    await this.examenesRepository.save(examen);

    // Crear las relaciones examen_insumo
    if (insumos && insumos.length > 0) {
      const insumoExamenEntities = insumos.map((insumoDto) => {
        return this.insumoExamenRepository.create({
          examen: { id: examen.id },  // ID del examen recién creado
          insumo: { id: insumoDto.insumoId },
          cantidad: insumoDto.cantidad,
        });
      });
      await this.insumoExamenRepository.save(insumoExamenEntities);
    }

    return examen;
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
    const examen = await this.examenesRepository.findOne({ where: { id, is_active: true } });
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado o desactivado`);
    }
    return examen;
  }

  // Actualizar un examen
  async update(id: string, updateExamenDto: UpdateExamenDto) {
    const examen = await this.findOne(id); // Validamos que el examen existe y está activo

    this.examenesRepository.merge(examen, updateExamenDto);
    return this.examenesRepository.save(examen);
  }

  // Soft delete para un examen
  async remove(id: string) {
    const examen = await this.findOne(id); // Validamos que el examen existe y está activo
    examen.is_active = false; // Cambiamos el estado a inactivo
    return this.examenesRepository.save(examen);
  }
}
