import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import IndiceInsumo from './entities/indice_insumo.entity';
import { Repository } from 'typeorm';
import UpdateIndiceInsumoDto from './dtos/update-indice-insumo.dto';
import CreateIndiceInsumoDto from './dtos/create-indice-insumo.dto';

@Injectable()
export class IndiceInsumosService {
    constructor(
        @InjectRepository(IndiceInsumo)
        private readonly indiceInsumoRepository: Repository<IndiceInsumo>,
    ) {}

    findAll() {
        return this.indiceInsumoRepository.find();
    }

    async findOne(id: number) {
        const indiceInsumo = await this.indiceInsumoRepository.findOne({ where: { id } });

        if (!indiceInsumo) {
            throw new NotFoundException(`IndiceInsumo con id ${id} no encontrado`);
        }

        return indiceInsumo;
    }

    async update(id: number, updateIndiceInsumoDto: UpdateIndiceInsumoDto) {
        const indiceInsumo = await this.findOne(id);

        this.indiceInsumoRepository.merge(indiceInsumo, updateIndiceInsumoDto);

        return this.indiceInsumoRepository.save(indiceInsumo);
    }

    create(createIndiceInsumoDto: CreateIndiceInsumoDto) {
        const indiceInsumo = this.indiceInsumoRepository.create(createIndiceInsumoDto);
        return this.indiceInsumoRepository.save(indiceInsumo);
    }

    async remove(id: number) {
        const indiceInsumo = await this.findOne(id);
        return this.indiceInsumoRepository.remove(indiceInsumo);
    }
}
