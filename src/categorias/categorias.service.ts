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

    // Obtener todas las categorías que están activas
    findAll() {
        return this.categoriaRepository.find({ where: { is_active: true } });
    }

    // Obtener una categoría por ID (solo si está activa)
    async findOne(id: string) {
        const categoria = await this.categoriaRepository.findOne({ where: { id, is_active: true } });

        if (!categoria) {
            throw new NotFoundException(`Categoría con id ${id} no encontrada`);
        }

        return categoria;
    }

    // Crear una nueva categoría
    create(createCategoriaDto: CreateCategoriaDto) {
        const categoria = this.categoriaRepository.create(createCategoriaDto);
        return this.categoriaRepository.save(categoria);
    }

    // Actualizar una categoría
    async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
        const categoria = await this.findOne(id);  // Asegurarse de que la categoría existe
        this.categoriaRepository.merge(categoria, updateCategoriaDto);
        return this.categoriaRepository.save(categoria);
    }

    // Realizar un soft delete marcando is_active a false
    async remove(id: string) {
        const categoria = await this.findOne(id);  // Asegurarse de que la categoría existe

        // Realiza el "soft delete" actualizando is_active a false
        categoria.is_active = false;
        return this.categoriaRepository.save(categoria);  // Guarda la categoría actualizada
    }
}
