import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Categoria from './entities/categoria.entity';
import CreateCategoriaDto from './dtos/create-categoria.dto';
import UpdateCategoriaDto from './dtos/update-categoria.dto';

@Injectable()
export class CategoriasService {
    constructor(
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
    ) {}

    async findAll() {
        return await this.categoriaRepository.find();
    }

    async findOne(id: string) {
        const categoria = await this.categoriaRepository.findOne({ where: { id } });
        if (!categoria) {
            throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        return categoria;
    }

    async create(createCategoriaDto: CreateCategoriaDto) {
        const categoria = this.categoriaRepository.create(createCategoriaDto);
        return await this.categoriaRepository.save(categoria);
    }

    async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
        const categoria = await this.findOne(id);
        this.categoriaRepository.merge(categoria, updateCategoriaDto);
        return await this.categoriaRepository.save(categoria);
    }

    async remove(id: string) {
        const categoria = await this.findOne(id);
        return await this.categoriaRepository.remove(categoria);
    }
}
