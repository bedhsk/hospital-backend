import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    const { insumoId, examenId, cantidad, ...rest } = createInsumoExamenDto;

    // Verificar si el insumo existe
    const insumo = await this.insumoRepository.findOne({ where: { id: insumoId } });
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${insumoId} no encontrado`);
    }

    // Verificar si el examen existe
    const examen = await this.examenRepository.findOne({ where: { id: examenId } });
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${examenId} no encontrado`);
    }

    // Buscar si ya existe la relación entre el insumo y el examen
    const insumoExamenExistente = await this.insumoExamenRepository.findOne({
      where: {
        insumo: { id: insumoId },
        examen: { id: examenId },
      },
    });

    if (insumoExamenExistente) {
      // Si ya existe la relación, arrojar excepción
      throw new ConflictException('La relación entre este insumo y examen ya existe. Por favor, use el método de actualización para modificar la cantidad.');
    }

    // Si no existe la relación, crear una nueva
    const nuevoInsumoExamen = this.insumoExamenRepository.create({
      insumo,
      examen,
      cantidad,
      ...rest,
    });

    return this.insumoExamenRepository.save(nuevoInsumoExamen);
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
    const { insumoId, examenId, cantidad } = updateInsumoExamenDto;

    // Obtener la relación actual
    const insumoExamen = await this.findOne(id);
    if (!insumoExamen) {
      throw new NotFoundException(`Relación insumo-examen con ID ${id} no encontrada`);
    }

    // Verificar si se ha cambiado el insumoId o examenId
    if (insumoId && examenId) {
      // Buscar si ya existe otra relación con el nuevo insumo y examen
      const insumoExamenExistente = await this.insumoExamenRepository.findOne({
        where: {
          insumo: { id: insumoId },
          examen: { id: examenId },
        },
      });

      if (insumoExamenExistente && insumoExamenExistente.id !== id) {
        // Si existe otra relación y no es la misma, combinar las cantidades
        insumoExamenExistente.cantidad = cantidad; // Sustituir la cantidad
        await this.insumoExamenRepository.save(insumoExamenExistente);

        // Eliminar la relación anterior ya que fue combinada
        await this.insumoExamenRepository.remove(insumoExamen);

        return insumoExamenExistente;
      }
    }

    // Si no hay conflicto, proceder con la actualización normal
    this.insumoExamenRepository.merge(insumoExamen, updateInsumoExamenDto);
    return await this.insumoExamenRepository.save(insumoExamen);
  }


  // Soft Delete: desactivar una relación entre insumo y examen
  async remove(id: string) {
    const insumoExamen = await this.findOne(id);

    insumoExamen.is_active = false;  // Desactivar el registro
    return this.insumoExamenRepository.save(insumoExamen);
  }
}
