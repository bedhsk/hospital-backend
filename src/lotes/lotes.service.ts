import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateLoteDto } from './dto/update-lote.dto';
import CreateLoteDto from './dto/create-lote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import QueryLoteDto from './dto/query-lote.dto';
import Lote from './entities/lote.entity';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';
import { createNewLoteDto } from './dto/create-new-lote.dto';
import { log } from 'console';

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,
    private readonly insumoDepartamentoService: InsumoDepartamentosService,
  ) {}

  // Obtener todos los lotes activos
  async findAll(query: QueryLoteDto) {
    const { q, filter, page, limit } = query;
    const queryBuilder = this.loteRepository
      .createQueryBuilder('lote')
      .where({ is_active: true })
      .leftJoinAndSelect('lote.insumoDepartamento', 'insumoDepartamento')
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo')
      .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
      .select([
        'lote.id',
        'lote.numeroLote',
        'lote.created_at',
        'lote.fechaCaducidad',
        'lote.cantidadInical',
        'lote.cantidadActual',
        'lote.status',
        'lote.insumoDepartamentoId',
        'insumoDepartamento.id',
        'insumoDepartamento.existencia',
        'insumo.id',
        'insumo.nombre',
        'departamento.id',
        'departamento.nombre',
      ]);

    if (q) {
      queryBuilder.andWhere('lote.numeroLote LIKE :numeroLote', {
        numeroLote: `%${q}%`,
      });
    }

    if (filter) {
      queryBuilder.andWhere('insumoDepartamento.existencia = :existencia', {
        existencia: `${filter}`,
      });
    }

    const totalItems = await queryBuilder.getCount();
    const lotes = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: lotes,
      totalItems,
      totalPages,
      page,
    };
  }

  // Buscar un lote activo por su ID
  async findOne(id: string) {
    const lote = await this.loteRepository.findOne({
      where: { id, is_active: true },
      relations: ['insumoDepartamento', 'insumoDepartamento.insumo'],
    });
    if (!lote) {
      throw new NotFoundException(
        `Lote con ID ${id} no encontrado o desactivado`,
      );
    }
    return lote;
  }

  // Obtener el lote proximo a vencer.
  async getLoteProximoVencer(insumoDepartamentoId: string) {
    const lote = await this.loteRepository
      .createQueryBuilder('lote')
      .where('lote.is_active = true')
      .andWhere('lote.insumoDepartamentoId = :insumoDepartamentoId', {
        insumoDepartamentoId,
      })
      .andWhere('lote.cantidadActual > 0')
      .orderBy('lote.fechaCaducidad', 'ASC')
      .getOne();

    if (!lote) {
      throw new NotFoundException(
        `No se encontró un lote con cantidad disponible para el insumoDepartamentoId ${insumoDepartamentoId}`,
      );
    }

    return lote;
  }

  async findOneByNumeroLoteAndDepartamentoId(numeroLote: string, departamentoId: string) {
    const lote = await this.loteRepository
      .createQueryBuilder('lote')
      .leftJoinAndSelect('lote.insumoDepartamento', 'insumoDepartamento')
      .where('lote.is_active = true')
      .andWhere('lote.numeroLote = :numeroLote', { numeroLote })
      .andWhere('insumoDepartamento.departamentoId = :departamentoId', { departamentoId })
      .getOne();

    return lote;
  }

  async getLoteByDepartamentoId(departamentoId: string, lote: createNewLoteDto) {
    const loteAux = await this.findOneByNumeroLoteAndDepartamentoId(lote.numeroLote, departamentoId);
    const insumoDepartamento = await this.insumoDepartamentoService.findOneByInsumoAndDepartamento(lote.insumoId, departamentoId, true);
    if (!insumoDepartamento) {
      throw new NotFoundException(`InsumoDepartamento con id ${lote.insumoId} no encontrado`);
    }
    if (!loteAux) {
      return await this.create(
        {
          numeroLote: lote.numeroLote,
          fechaCaducidad: lote.fechaCaducidad,
          cantidadInical: lote.cantidadInical,
          cantidadActual: 0,
          status: 'disponible',
          insumoDepartamentoId: insumoDepartamento.id
        }
      );
    }
    return loteAux;
  }
  

  // Crear un nuevo lote
  async create(createLoteDto: CreateLoteDto) {
    const { insumoDepartamentoId, cantidadInical, cantidadActual, ...rest } =
      createLoteDto;

    const insumoDepartamento = await this.insumoDepartamentoService.findOne(
      createLoteDto.insumoDepartamentoId,
    );

    if (!insumoDepartamento) {
      throw new NotFoundException(
        `InsumoDepartamento con id ${insumoDepartamentoId} no encontrado`,
      );
    }

    // Crear el lote con las relaciones establecidas
    const lote = this.loteRepository.create({
      cantidadInical,
      cantidadActual: cantidadActual ?? cantidadInical,
      ...rest,
      insumoDepartamento,
    });
    return this.loteRepository.save(lote);
  }

  // Actualizar un lote existente, si está activo
  async update(id: string, updateLoteDto: UpdateLoteDto) {
    const lote = await this.findOne(id);
    if (!lote) {
      throw new NotFoundException(
        `Lote con ID ${id} no encontrado o desactivado`,
      );
    }
    this.loteRepository.merge(lote, updateLoteDto);
    return await this.loteRepository.save(lote);
  }

  // Logica para descontar del lote proximo a vencer
  async updateRetiroLote(insumoDepartamentoId: string, cantdad: number) {
    let cantidadRestante = cantdad;
    let cantidadDesc = 0
    const lotes: createNewLoteDto[] = []
    while (cantidadRestante > 0) {
      const lote = await this.getLoteProximoVencer(insumoDepartamentoId);

      if (!lote) {
        throw new NotFoundException(
          lotes,
          `No hay suficientes lotes disponibles para completar el retiro de ${cantdad}. Restante: ${cantidadRestante}`,
        );
      }

      if (lote.cantidadActual <= cantidadRestante) {
        cantidadRestante -= lote.cantidadActual;
        cantidadDesc = lote.cantidadActual;
        lote.cantidadActual = 0;
      } else {
        lote.cantidadActual -= cantidadRestante;
        cantidadDesc = cantidadRestante;
        cantidadRestante = 0;
      }

      await this.loteRepository.save(lote);
      const loteaux = await this.findOne(lote.id);
      loteaux.cantidadInical = cantidadDesc;
      lotes.push({
        id: loteaux.id,
        insumoId: loteaux.insumoDepartamento.insumo.id,
        numeroLote: loteaux.numeroLote,
        cantidadInical: cantidadDesc,
        fechaCaducidad: loteaux.fechaCaducidad
      })
    }

    return lotes;
  }

  // Logica para descontar del lote proximo a vencer
  async updateAdquisicionLote(lote: createNewLoteDto, insumoDepartamentoId: string) {
    const insumoDepartamento = await this.insumoDepartamentoService.findOne(insumoDepartamentoId);
    const loteAux = await this.getLoteByDepartamentoId(insumoDepartamento.departamento.id, lote);
    loteAux.cantidadActual += lote.cantidadInical;
    const loteAux2 = await this.update(loteAux.id, loteAux);
    return loteAux2;
  }

  // Soft delete para un lote
  async softDelete(id: string) {
    const lote = await this.findOne(id);
    if (!lote) {
      throw new NotFoundException(
        `Lote con ID ${id} no encontrado o ya desactivado`,
      );
    }
    // Soft delete: cambia el campo is_active a false
    lote.is_active = false;
    return await this.loteRepository.save(lote);
  }
}
