import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import InsumoExamen from './entities/insumo_examen.entity';
import CreateInsumoExamenDto from './dtos/create-insumo_examen.dto';
import UpdateInsumoExamenDto from './dtos/update-insumo_examen.dto';
import QueryInsumoExamenDto from './dtos/query-insumo_examen.dto';
import Insumo from 'src/insumos/entities/insumo.entity';
import Examen from 'src/examenes/entities/examen.entity';

@Injectable()
export class InsumoExamenesService {
  constructor(
    @InjectRepository(InsumoExamen)
    private readonly insumoExamenRepository: Repository<InsumoExamen>,

    @InjectRepository(Insumo)
    private readonly insumoRepository: Repository<Insumo>,

    @InjectRepository(Examen)
    private readonly examenRepository: Repository<Examen>,
  ) {}

  // Crear una nueva relación entre insumo y examen
  async create(createInsumoExamenDto: CreateInsumoExamenDto) {
    const { insumoId, examenId, ...rest } = createInsumoExamenDto;

    const insumo = await this.insumoRepository.findOne({ where: { id: insumoId } });
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${insumoId} no encontrado`);
    }

    const examen = await this.examenRepository.findOne({ where: { id: examenId } });
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${examenId} no encontrado`);
    }

    const insumoExamen = this.insumoExamenRepository.create({
      ...rest,
      insumo,
      examen,
    });

    return this.insumoExamenRepository.save(insumoExamen);
  }

  // Obtener todas las relaciones activas entre insumos y exámenes con filtros y paginación
  async findAll(query: QueryInsumoExamenDto) {
    const { insumoId, examenId, page = 1, limit = 10, is_active = true } = query;

    const queryBuilder = this.insumoExamenRepository.createQueryBuilder('insumoExamen')
      .leftJoinAndSelect('insumoExamen.insumo', 'insumo')
      .leftJoinAndSelect('insumoExamen.examen', 'examen')
      .where('insumoExamen.is_active = :is_active', { is_active });

    if (insumoId) {
      queryBuilder.andWhere('insumoExamen.insumoId = :insumoId', { insumoId });
    }

    if (examenId) {
      queryBuilder.andWhere('insumoExamen.examenId = :examenId', { examenId });
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

  // Obtener una relación entre insumo y examen por ID
  async findOne(id: string) {
    const insumoExamen = await this.insumoExamenRepository.findOne({
      where: { id, is_active: true },
      relations: ['insumo', 'examen'],
    });

    if (!insumoExamen) {
      throw new NotFoundException(`InsumoExamen con ID ${id} no encontrado o desactivado`);
    }

    return insumoExamen;
  }

  // Actualizar una relación entre insumo y examen
  async update(id: string, updateInsumoExamenDto: UpdateInsumoExamenDto) {
    const insumoExamen = await this.findOne(id);
    
    this.insumoExamenRepository.merge(insumoExamen, updateInsumoExamenDto);
    return this.insumoExamenRepository.save(insumoExamen);
  }

  // Soft Delete: desactivar una relación entre insumo y examen
  async remove(id: string) {
    const insumoExamen = await this.findOne(id);

    insumoExamen.is_active = false;  // Desactivar el registro
    return this.insumoExamenRepository.save(insumoExamen);
  }
}
