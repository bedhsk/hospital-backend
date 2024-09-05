import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MovimientoInsumo from './entities/movimiento_insumo.entity';
import { Repository } from 'typeorm';
import UpdateMovimientoInsumoDto from './dtos/update-movimiento-insumo.dto';
import CreateMovimientoInsumoDto from './dtos/create-movimiento-insumo.dto';

@Injectable()
export class MovimientoInsumosService {
    constructor(
        @InjectRepository(MovimientoInsumo)
        private readonly movimientoInsumoRepository: Repository<MovimientoInsumo>,
    ) {}

    findAll() {
        return this.movimientoInsumoRepository.find();
    }

    async findOne(id: number) {
        const movimientoInsumo = await this.movimientoInsumoRepository.findOne({ where: { id } });

        if (!movimientoInsumo) {
            throw new NotFoundException(`MovimientoInsumo con id ${id} no encontrado`);
        }

        return movimientoInsumo;
    }

    async update(id: number, updateMovimientoInsumoDto: UpdateMovimientoInsumoDto) {
        const movimientoInsumo = await this.findOne(id);

        this.movimientoInsumoRepository.merge(movimientoInsumo, updateMovimientoInsumoDto);

        return this.movimientoInsumoRepository.save(movimientoInsumo);
    }

    create(createMovimientoInsumoDto: CreateMovimientoInsumoDto) {
        const movimientoInsumo = this.movimientoInsumoRepository.create(createMovimientoInsumoDto);
        return this.movimientoInsumoRepository.save(movimientoInsumo);
    }

    async remove(id: number) {
        const movimientoInsumo = await this.findOne(id);
        return this.movimientoInsumoRepository.remove(movimientoInsumo);
    }
}
