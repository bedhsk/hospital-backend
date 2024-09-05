import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Insumo from './entities/insumo.entity';
import { Repository } from 'typeorm';
import UpdateInsumoDto from './dtos/update-insumo.dto';
import CreateInsumoDto from './dtos/create-insumo.dto';

@Injectable()
export class InsumosService {
    constructor(
        @InjectRepository(Insumo)
        private readonly insumoRepository: Repository<Insumo>,
    ) {}

    findAll() {
        return this.insumoRepository.find();
    }

    async findOne(id: number) {
        const insumo = await this.insumoRepository.findOne({ where: { id } });

        if (!insumo) {
            throw new NotFoundException(`Insumo con id ${id} no encontrado`);
        }

        return insumo;
    }

    async update(id: number, updateInsumoDto: UpdateInsumoDto) {
        const insumo = await this.findOne(id);

        this.insumoRepository.merge(insumo, updateInsumoDto);

        return this.insumoRepository.save(insumo);
    }

    create(createInsumoDto: CreateInsumoDto) {
        const insumo = this.insumoRepository.create(createInsumoDto);
        return this.insumoRepository.save(insumo);
    }

    async remove(id: number) {
        const insumo = await this.findOne(id);
        return this.insumoRepository.remove(insumo);
    }
}
