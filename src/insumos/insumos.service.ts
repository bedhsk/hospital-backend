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
  ) { }

  // Método para obtener todos los insumos que están activos
  async findAll() {
    return await this.insumoRepository.find({ where: { is_active: true } });
  }

  // Método para obtener un solo insumo por ID si está activo
  async findOne(id: string) {
    const insumo = await this.insumoRepository.findOne({ where: { id, is_active: true } });
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${id} no encontrado o desactivado`);
    }
    return insumo;
  }

  // Crear un nuevo insumo
  async create(createInsumoDto: CreateInsumoDto) {
    const insumo = this.insumoRepository.create(createInsumoDto);
    return await this.insumoRepository.save(insumo);
  }

  // Actualizar un insumo existente, si está activo
  async update(id: string, updateInsumoDto: UpdateInsumoDto) {
    const insumo = await this.findOne(id);
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${id} no encontrado o desactivado`);
    }
    this.insumoRepository.merge(insumo, updateInsumoDto);
    return await this.insumoRepository.save(insumo);
  }

  // Realiza el soft delete cambiando el campo is_active a false
  async softDelete(id: string) {
    const insumo = await this.findOne(id);
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${id} no encontrado o ya desactivado`);
    }
    // Cambiamos el campo is_active a false para realizar el soft delete
    insumo.is_active = false;
    return await this.insumoRepository.save(insumo);
  }
}
