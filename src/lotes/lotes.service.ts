import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Lote from './entities/lote.entity';
import { Repository } from 'typeorm';
import UpdateLoteDto from './dtos/update-lote.dto';
import CreateLoteDto from './dtos/create-lote.dto';

@Injectable()
export class LotesService {
    constructor(
        @InjectRepository(Lote)
        private readonly loteRepository: Repository<Lote>,
    ) {}

    findAll() {
        return this.loteRepository.find();
    }

    async findOne(id: number) {
        const lote = await this.loteRepository.findOne({ where: { id } });

        if (!lote) {
            throw new NotFoundException(`Lote con id ${id} no encontrado`);
        }

        return lote;
    }

    async update(id: number, updateLoteDto: UpdateLoteDto) {
        const lote = await this.findOne(id);

        this.loteRepository.merge(lote, updateLoteDto);

        return this.loteRepository.save(lote);
    }

    create(createLoteDto: CreateLoteDto) {
        const lote = this.loteRepository.create(createLoteDto);
        return this.loteRepository.save(lote);
    }

    async remove(id: number) {
        const lote = await this.findOne(id);
        return this.loteRepository.remove(lote);
    }
}
