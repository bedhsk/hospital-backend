import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateLoteDto } from './dto/update-lote.dto';
import CreateLoteDto from './dto/create-lote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import QueryLoteDto from './dto/query-lote.dto';
import Lote from './entities/lote.entity';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';

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
      .select([
        'lote.id',
        'lote.numeroLote',
        'lote.fechaEntrada',
        'lote.fechaCaducidad',
        'lote.cantidadInical',
        'lote.cantidadActual',
        'lote.status',
        'lote.insumoDepartamentoId',
        'insumoDepartamento.id',
        'insumoDepartamento.existencia',
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
      relations: ['insumoDepartamento'],
    });
    if (!lote) {
      throw new NotFoundException(
        `Lote con ID ${id} no encontrado o desactivado`,
      );
    }
    return lote;
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
      cantidadActual: cantidadActual || cantidadInical,
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
