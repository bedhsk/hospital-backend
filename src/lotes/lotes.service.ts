import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Lote from './entities/lote.entity';
import CreateLoteDto from './dtos/create-lote.dto';
import UpdateLoteDto from './dtos/update-lote.dto';

@Injectable()
export class LotesService {
    constructor(
        @InjectRepository(Lote)
        private readonly loteRepository: Repository<Lote>,
    ) {}

    async findAll() {
        return await this.loteRepository.find();
    }

    async findOne(id: string) {  
        const lote = await this.loteRepository.findOne({ where: { id } });
        if (!lote) {
            throw new NotFoundException(`Lote con ID ${id} no encontrado`);
        }
        return lote;
    }

    async create(createLoteDto: CreateLoteDto) {
        const lote = this.loteRepository.create(createLoteDto);
        return await this.loteRepository.save(lote);
    }

    async update(id: string, updateLoteDto: UpdateLoteDto) {
        const lote = await this.findOne(id);
        this.loteRepository.merge(lote, updateLoteDto);
        return await this.loteRepository.save(lote);
    }

    async remove(id: string) {
        const lote = await this.findOne(id);
        return await this.loteRepository.remove(lote);
    }
}
