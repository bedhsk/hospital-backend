import { Injectable, NotFoundException } from '@nestjs/common';
import Examen from './entities/examen.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateExamenDto from './dtos/create-examen.dto';
import { InsumoExamenesService } from 'src/insumo_examenes/insumo_examenes.service'; // Importamos el servicio
import UpdateExamenDto from './dtos/update-examen.dto';
import QueryExamenDto from './dtos/query-examen.dto';
import { log } from 'console';

@Injectable()
export class ExamenesService {
  constructor(
    @InjectRepository(Examen)
    private readonly examenesRepository: Repository<Examen>,
    private readonly insumoExamenesService: InsumoExamenesService,
  ) {}

  async create(createExamenDto: CreateExamenDto) {
    const { nombre, insumos, ...rest } = createExamenDto;

    const examen = this.examenesRepository.create({
      nombre,
      ...rest,
    });

    const examenGuardado = await this.examenesRepository.save(examen);

    if (insumos && insumos.length > 0) {
      const insumoPromises = insumos.map(async (element) => {
        const { insumoId, cantidad, uso } = element;

        if (!insumoId) {
          throw new Error('El insumoId no puede ser nulo');
        }

        return await this.insumoExamenesService.create({
          examenId: examenGuardado.id,
          insumoId,
          cantidad,
          uso,
        });
      });

      await Promise.all(insumoPromises);
    }

    // Buscar el examen y transformar la respuesta
    const examenCompleto = await this.examenesRepository.findOne({
      where: { id: examenGuardado.id },
      relations: ['insumoExamenes', 'insumoExamenes.insumo'],
    });

    // Transformar la respuesta para excluir cada_horas y por_dias
    return {
      id: examenCompleto.id,
      nombre: examenCompleto.nombre,
      descripcion: examenCompleto.descripcion,
      insumoExamenes: examenCompleto.insumoExamenes.map((ie) => ({
        id: ie.id,
        cantidad: ie.cantidad,
        insumo: {
          id: ie.insumo.id,
          codigo: ie.insumo.codigo,
          nombre: ie.insumo.nombre,
        },
      })),
    };
  }

  // Obtener todos los exámenes con Soft Delete (solo los que estén activos)
  async findAll(query: QueryExamenDto) {
    const { q, page = 1, limit = 10 } = query;

    const queryBuilder = this.examenesRepository
      .createQueryBuilder('examen')
      .select([
        'examen.id',
        'examen.nombre',
        'examen.descripcion',
        'examen.is_active',
      ])
      .leftJoin('examen.insumoExamenes', 'insumoExamen')
      .addSelect([
        'insumoExamen.id',
        'insumoExamen.cantidad',
        'insumoExamen.is_active',
      ])
      .leftJoin('insumoExamen.insumo', 'insumo')
      .addSelect([
        'insumo.id',
        'insumo.codigo',
        'insumo.nombre',
        'insumo.trazador',
        'insumo.is_active',
      ])
      .leftJoin('insumo.categoria', 'categoria')
      .addSelect(['categoria.id', 'categoria.nombre', 'categoria.is_active'])
      .where('examen.is_active = :isActive', { isActive: true });

    if (q) {
      queryBuilder.andWhere('unaccent(examen.nombre) ILIKE unaccent(:nombre)', {
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

  async findAnyOne(id: string) {
    const examen = await this.examenesRepository.findOne({
      where: { id },
      relations: ['insumoExamenes'],
    });

    if (!examen) {
      throw new NotFoundException(
        `Examen con ID ${id} no encontrado o desactivado`,
      );
    }

    return examen;
  }

  async activate(id: string) {
    const examen = await this.findAnyOne(id); // Validamos que el examen existe
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado`);
    }
    examen.is_active = true; // Cambiamos el estado a activo

    return this.examenesRepository.save(examen);
  }

  async desactivate(id: string) {
    const examen = await this.findAnyOne(id); // Validamos que el examen existe
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado`);
    }
    examen.is_active = false; // Cambiamos el estado a inactivo
    return this.examenesRepository.save(examen);
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
    try {
      const examen = await this.examenesRepository.findOne({
        where: { id, is_active: true },
        relations: ['insumoExamenes', 'insumoExamenes.insumo'],
      });

      if (!examen) {
        throw new NotFoundException(
          `Examen con ID ${id} no encontrado o inactivo`,
        );
      }

      const { insumos, ...examenData } = updateExamenDto;

      // Actualizamos datos básicos
      this.examenesRepository.merge(examen, examenData);
      const updatedExamen = await this.examenesRepository.save(examen);

      if (insumos) {
        try {
          // Eliminamos insumos existentes
          await this.insumoExamenesService.removeByExamenId(id);

          // Agregamos nuevos insumos
          const insumoPromises = insumos.map((element) => {
            const { insumoId, cantidad, uso } = element;
            if (!insumoId) {
              throw new Error('El insumoId no puede ser nulo');
            }
            return this.insumoExamenesService.create({
              examenId: updatedExamen.id,
              insumoId,
              cantidad,
              uso,
            });
          });

          await Promise.all(insumoPromises);
        } catch (error) {
          throw new Error(`Error actualizando insumos: ${error.message}`);
        }
      }

      return await this.examenesRepository.findOne({
        where: { id: updatedExamen.id },
        relations: ['insumoExamenes', 'insumoExamenes.insumo'],
      });
    } catch (error) {
      if (error) {
        throw error;
      }
      throw new Error(`Error actualizando examen: ${error.message}`);
    }
  }

  // Soft delete para un examen
  async remove(id: string) {
    const examen = await this.findOne(id); // Validamos que el examen existe y está activo
    examen.is_active = false; // Cambiamos el estado a inactivo
    return this.examenesRepository.save(examen);
  }
}
