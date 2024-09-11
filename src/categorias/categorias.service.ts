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
  ) { }

  async findAll() {
    // Solo devuelve las categorías activas
    return await this.categoriaRepository.find({ where: { is_active: true } });
  }

  async findOne(id: string) {
    const categoria = await this.categoriaRepository.findOne({ where: { id, is_active: true } });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada o desactivada`);
    }
    return categoria;
  }

  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada o desactivada`);
    }
    this.categoriaRepository.merge(categoria, updateCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async softDelete(id: string) {
    const categoria = await this.findOne(id);
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada o ya desactivada`);
    }
    // Realiza el soft delete actualizando el campo `is_active`
    categoria.is_active = false;
    return await this.categoriaRepository.save(categoria);
  }
}
