import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateMovimientoInsumoDto from './dtos/create-movimiento-insumo.dto';
import UpdateMovimientoInsumoDto from './dtos/update-movimiento-insumo.dto';
import MovimientoInsumo from './entities/movimiento_insumo.entity';
import Insumo from 'src/insumos/entities/insumo.entity';

@Injectable()
export class MovimientoInsumosService {
    constructor(
        @InjectRepository(MovimientoInsumo)
        private readonly movimientoInsumoRepository: Repository<MovimientoInsumo>,
        @InjectRepository(Insumo)
        private readonly insumoRepository: Repository<Insumo>,
    ) {}

    // Crear un nuevo MovimientoInsumo
    async create(createMovimientoInsumoDto: CreateMovimientoInsumoDto) {
        const { insumoId, ...movimientoData } = createMovimientoInsumoDto;

        // Busca el insumo relacionado por insumoId
        const insumo = await this.insumoRepository.findOneBy({ id: insumoId });
        if (!insumo) {
            throw new NotFoundException(`Insumo con id ${insumoId} no encontrado`);
        }

        // Crea el movimiento relacionado con el insumo
        const movimientoInsumo = this.movimientoInsumoRepository.create({
            ...movimientoData,
            insumo, // Asigna la relación con el Insumo
        });

        return this.movimientoInsumoRepository.save(movimientoInsumo);
    }

    // Obtener todos los MovimientoInsumos
    findAll() {
        return this.movimientoInsumoRepository.find({
            relations: ['insumo'],  // Para cargar también la relación con Insumo
        });
    }

    // Obtener un MovimientoInsumo por ID
    async findOne(id: number) {
        const movimientoInsumo = await this.movimientoInsumoRepository.findOne({
            where: { id },
            relations: ['insumo'],  // Para cargar también la relación con Insumo
        });

        if (!movimientoInsumo) {
            throw new NotFoundException(`MovimientoInsumo con id ${id} no encontrado`);
        }

        return movimientoInsumo;
    }

    // Actualizar un MovimientoInsumo
    async update(id: number, updateMovimientoInsumoDto: UpdateMovimientoInsumoDto) {
        const { insumoId, ...movimientoData } = updateMovimientoInsumoDto;

        // Busca el MovimientoInsumo que deseas actualizar
        const movimientoInsumo = await this.findOne(id);

        // Si se proporciona un insumoId, actualiza la relación con el Insumo
        if (insumoId) {
            const insumo = await this.insumoRepository.findOneBy({ id: insumoId });
            if (!insumo) {
                throw new NotFoundException(`Insumo con id ${insumoId} no encontrado`);
            }
            movimientoInsumo.insumo = insumo;
        }

        // Actualiza los demás campos
        this.movimientoInsumoRepository.merge(movimientoInsumo, movimientoData);

        return this.movimientoInsumoRepository.save(movimientoInsumo);
    }

    // Eliminar un MovimientoInsumo
    async remove(id: number) {
        const movimientoInsumo = await this.findOne(id);
        return this.movimientoInsumoRepository.remove(movimientoInsumo);
    }
}