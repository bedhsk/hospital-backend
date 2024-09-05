import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateLoteDto from './dtos/create-lote.dto';
import UpdateLoteDto from './dtos/update-lote.dto';
import Lote from './entities/lote.entity';
import Insumo from 'src/insumos/entities/insumo.entity';

@Injectable()
export class LotesService {
    constructor(
        @InjectRepository(Lote)
        private readonly loteRepository: Repository<Lote>,
        @InjectRepository(Insumo)
        private readonly insumoRepository: Repository<Insumo>,
    ) {}

    // Crear un nuevo Lote
    async create(createLoteDto: CreateLoteDto) {
        const { insumoId, ...loteData } = createLoteDto;

        // Busca el insumo relacionado por insumoId
        const insumo = await this.insumoRepository.findOneBy({ id: insumoId });
        if (!insumo) {
            throw new NotFoundException(`Insumo con id ${insumoId} no encontrado`);
        }

        // Crea el lote relacionado con el insumo
        const lote = this.loteRepository.create({
            ...loteData,
            insumo, // Asigna la relación con el Insumo
        });

        return this.loteRepository.save(lote);
    }

    // Obtener todos los Lotes
    findAll() {
        return this.loteRepository.find({
            relations: ['insumo'],  // Para cargar también la relación con Insumo
        });
    }

    // Obtener un Lote por ID
    async findOne(id: number) {
        const lote = await this.loteRepository.findOne({
            where: { id },
            relations: ['insumo'],  // Para cargar también la relación con Insumo
        });

        if (!lote) {
            throw new NotFoundException(`Lote con id ${id} no encontrado`);
        }

        return lote;
    }

    // Actualizar un Lote
    async update(id: number, updateLoteDto: UpdateLoteDto) {
        const { insumoId, ...loteData } = updateLoteDto;

        // Busca el Lote que deseas actualizar
        const lote = await this.findOne(id);

        // Si se proporciona un insumoId, actualiza la relación con el Insumo
        if (insumoId) {
            const insumo = await this.insumoRepository.findOneBy({ id: insumoId });
            if (!insumo) {
                throw new NotFoundException(`Insumo con id ${insumoId} no encontrado`);
            }
            lote.insumo = insumo;
        }

        // Actualiza los demás campos
        this.loteRepository.merge(lote, loteData);

        return this.loteRepository.save(lote);
    }

    // Eliminar un Lote
    async remove(id: number) {
        const lote = await this.findOne(id);
        return this.loteRepository.remove(lote);
    }
}
