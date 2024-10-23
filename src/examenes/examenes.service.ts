import { Injectable, NotFoundException } from '@nestjs/common';
import Examen from './entities/examen.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateExamenDto from './dtos/create-examen.dto';
import { InsumoExamenesService } from 'src/insumo_examenes/insumo_examenes.service'; // Importamos el servicio
import UpdateExamenDto from './dtos/update-examen.dto';
import QueryExamenDto from './dtos/query-examen.dto';

@Injectable()
export class ExamenesService {
  constructor(
    @InjectRepository(Examen)
    private readonly examenesRepository: Repository<Examen>,
    private readonly insumoExamenesService: InsumoExamenesService,
  ) {}

  async create(createExamenDto: CreateExamenDto) {
    const { nombre, insumos, ...rest } = createExamenDto;

    // console.log('Insumos recibidos:', insumos); // Verificación de insumos

    const examen = this.examenesRepository.create({
      nombre,
      ...rest,
    });

    const examenGuardado = await this.examenesRepository.save(examen);

    if (insumos && insumos.length > 0) {
      const insumoPromises = insumos.map(async (element) => {
        const { insumoId, cantidad } = element;

        // console.log('Insumo ID:', insumoId); // Verificación de insumoId

        if (!insumoId) {
          throw new Error('El insumoId no puede ser nulo');
        }

        return await this.insumoExamenesService.create({
          examenId: examenGuardado.id,
          insumoId,
          cantidad,
        });
      });

      await Promise.all(insumoPromises);
    }

    return await this.findOne(examenGuardado.id);
  }

  // Obtener todos los exámenes con Soft Delete (solo los que estén activos)
  async findAll(query: QueryExamenDto) {
    const { q, page = 1, limit = 10 } = query;

    const queryBuilder = this.examenesRepository
      .createQueryBuilder('examen')
      .leftJoinAndSelect('examen.insumoExamenes', 'insumoExamen')
      .leftJoinAndSelect('insumoExamen.insumo', 'insumo')
      .leftJoinAndSelect('insumo.categoria', 'categoria')
      .where('examen.is_active = :isActive', { isActive: true });

    if (q) {
      queryBuilder.andWhere('examen.nombre ILIKE :nombre', {
        nombre: `%${q}%`,
      });
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

  async findOne(id: string) {
    const examen = await this.examenesRepository.findOne({
      where: { id, is_active: true },
      relations: ['insumoExamenes'],
    });

    if (!examen) {
      throw new NotFoundException(
        `Examen con ID ${id} no encontrado o desactivado`,
      );
    }

    return examen;
  }

  async findOneWithInsumos(id: string) {
    const examen = await this.examenesRepository
      .createQueryBuilder('examen')
      .leftJoinAndSelect('examen.insumoExamenes', 'insumoExamen')
      .leftJoinAndSelect('insumoExamen.insumo', 'insumo')
      .leftJoinAndSelect('insumo.categoria', 'categoria') // Incluimos la categoría del insumo si es necesario
      .where('examen.id = :id', { id })
      .andWhere('examen.is_active = true')
      .getOne();

    if (!examen) {
      throw new NotFoundException(
        `Examen con ID ${id} no encontrado o desactivado`,
      );
    }

    // Transformamos el resultado para incluir la información del insumo

    return examen;
  }

  // El update elimina los insumos existentes y los agrega los nuevos
  async update(id: string, updateExamenDto: UpdateExamenDto) {
    const examen = await this.findOne(id); // Validamos que el examen existe y está activo
    const { insumos, ...examenData } = updateExamenDto;

    // Actualizamos los datos del examen
    this.examenesRepository.merge(examen, examenData);
    const updatedExamen = await this.examenesRepository.save(examen);

    if (insumos) {
      // Eliminamos los insumos existentes
      await this.insumoExamenesService.removeByExamenId(id);

      // Agregamos los nuevos insumos
      const insumoPromises = insumos.map(async (element) => {
        const { insumoId, cantidad } = element;
        if (!insumoId) {
          throw new Error('El insumoId no puede ser nulo');
        }
        return await this.insumoExamenesService.create({
          examenId: updatedExamen.id,
          insumoId,
          cantidad,
        });
      });

      await Promise.all(insumoPromises);
    }

    // Retornamos el examen actualizado con sus insumos
    return this.findOne(updatedExamen.id);
  }

  // Soft delete para un examen
  async remove(id: string) {
    const examen = await this.findOne(id); // Validamos que el examen existe y está activo
    examen.is_active = false; // Cambiamos el estado a inactivo
    return this.examenesRepository.save(examen);
  }
}
