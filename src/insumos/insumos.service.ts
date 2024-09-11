import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Insumo from './entities/insumo.entity';
import CreateInsumoDto from './dtos/create-insumo.dto';
import UpdateInsumoDto from './dtos/update-insumo.dto';

@Injectable()
export class InsumosService {
    constructor(
        @InjectRepository(Insumo)
        private readonly insumoRepository: Repository<Insumo>,
    ) {}

    async findAll() {
        return await this.insumoRepository.find();
    }

    async findOne(id: string) { 
        const insumo = await this.insumoRepository.findOne({ where: { id } });
        if (!insumo) {
            throw new NotFoundException(`Insumo con ID ${id} no encontrado`);
        }
        return insumo;
    }

    async create(createInsumoDto: CreateInsumoDto) {
        const insumo = this.insumoRepository.create(createInsumoDto);
        return await this.insumoRepository.save(insumo);
    }

    async update(id: string, updateInsumoDto: UpdateInsumoDto) {
        const insumo = await this.findOne(id);
        this.insumoRepository.merge(insumo, updateInsumoDto);
        return await this.insumoRepository.save(insumo);
    }

    async remove(id: string) {
        const insumo = await this.findOne(id);
        return await this.insumoRepository.remove(insumo);
    }
}
