import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateIndiceInsumoDto from './dtos/create-indice-insumo.dto';
import UpdateIndiceInsumoDto from './dtos/update-indice-insumo.dto';
import IndiceInsumo from './entities/indice_insumo.entity';
import Insumo from 'src/insumos/entities/insumo.entity';

@Injectable()
export class IndiceInsumosService {
    constructor(
        @InjectRepository(IndiceInsumo)
        private readonly indiceInsumoRepository: Repository<IndiceInsumo>,
        @InjectRepository(Insumo)
        private readonly insumoRepository: Repository<Insumo>,
    ) {}

    // Método para crear un IndiceInsumo
    async create(createIndiceInsumoDto: CreateIndiceInsumoDto) {
        const { insumoId, ...indiceData } = createIndiceInsumoDto;

        // Busca el insumo relacionado por insumoId
        const insumo = await this.insumoRepository.findOneBy({ id: insumoId });
        if (!insumo) {
            throw new NotFoundException(`Insumo con id ${insumoId} no encontrado`);
        }

        // Crea el índice relacionado con el insumo
        const indiceInsumo = this.indiceInsumoRepository.create({
            ...indiceData,
            insumo, // Asigna la relación con el Insumo
        });

        return this.indiceInsumoRepository.save(indiceInsumo);
    }

    // Método para obtener todos los IndiceInsumos
    findAll() {
        return this.indiceInsumoRepository.find({
            relations: ['insumo'], // Para obtener también la relación con Insumo
        });
    }

    // Método para obtener un IndiceInsumo por ID
    async findOne(id: number) {
        const indiceInsumo = await this.indiceInsumoRepository.findOne({
            where: { id },
            relations: ['insumo'], // Para obtener también la relación con Insumo
        });

        if (!indiceInsumo) {
            throw new NotFoundException(`IndiceInsumo con id ${id} no encontrado`);
        }

        return indiceInsumo;
    }

    // Método para actualizar un IndiceInsumo
    async update(id: number, updateIndiceInsumoDto: UpdateIndiceInsumoDto) {
        const { insumoId, ...indiceData } = updateIndiceInsumoDto;

        // Busca el IndiceInsumo que deseas actualizar
        const indiceInsumo = await this.findOne(id);

        // Si se proporciona un insumoId, actualiza la relación con el Insumo
        if (insumoId) {
            const insumo = await this.insumoRepository.findOneBy({ id: insumoId });
            if (!insumo) {
                throw new NotFoundException(`Insumo con id ${insumoId} no encontrado`);
            }
            indiceInsumo.insumo = insumo;
        }

        // Actualiza los demás campos
        this.indiceInsumoRepository.merge(indiceInsumo, indiceData);

        return this.indiceInsumoRepository.save(indiceInsumo);
    }

    // Método para eliminar un IndiceInsumo
    async remove(id: number) {
        const indiceInsumo = await this.findOne(id);
        return this.indiceInsumoRepository.remove(indiceInsumo);
    }
}
