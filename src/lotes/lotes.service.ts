import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Lote from './entities/lote.entity';
import CreateLoteDto from './dtos/create-lote.dto';
import UpdateLoteDto from './dtos/update-lote.dto';
import QueryLoteDto from './dtos/query-lote.dto';

@Injectable()
export class LotesService {
    constructor(
        @InjectRepository(Lote)
        private readonly loteRepository: Repository<Lote>,
    ) { }

    // Obtener todos los lotes activos
    async findAll(query: QueryLoteDto) {
        const { q, filter, page, limit } = query;
        const queryBuilder = this.loteRepository.createQueryBuilder('lote')
          .where({ is_active: true })
          .leftJoinAndSelect('lote.insumoDepartamento', 'insumoDepartamento')
          .select([
            'lote.id',
            'lote.numeroLote',
            'lote.fechaFabricacion',
            'lote.fechaCaducidad',
            'lote.cantidad',
            'lote.insumoId',
            'lote.insumoDepartamentoId',
            'insumoDepartamento.id',
            'insumoDepartamento.existencia'
          ]);
    
        if (q) {
          queryBuilder.andWhere('lote.numeroLote LIKE :numeroLote', { numeroLote: `%${q}%` });
        }
    
        if (filter) {
          queryBuilder.andWhere('insumoDepartamento.existencia = :existencia', { existencia: `${filter}` });
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
        const lote = await this.loteRepository.findOne({ where: { id, is_active: true } });
        if (!lote) {
            throw new NotFoundException(`Lote con ID ${id} no encontrado o desactivado`);
        }
        return lote;
    }

    // Crear un nuevo lote
    async create(createLoteDto: CreateLoteDto) {
        const lote = this.loteRepository.create(createLoteDto);
        return await this.loteRepository.save(lote);
    }

    // Actualizar un lote existente, si está activo
    async update(id: string, updateLoteDto: UpdateLoteDto) {
        const lote = await this.findOne(id);
        if (!lote) {
            throw new NotFoundException(`Lote con ID ${id} no encontrado o desactivado`);
        }
        this.loteRepository.merge(lote, updateLoteDto);
        return await this.loteRepository.save(lote);
    }

    // Soft delete para un lote
    async softDelete(id: string) {
        const lote = await this.findOne(id);
        if (!lote) {
            throw new NotFoundException(`Lote con ID ${id} no encontrado o ya desactivado`);
        }
        // Soft delete: cambia el campo is_active a false
        lote.is_active = false;
        return await this.loteRepository.save(lote);
    }
}
