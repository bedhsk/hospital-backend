import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import InsumoDepartamento from './entities/insumo_departamento.entity';
import CreateInsumoDepartamentoDto from './dtos/create-insumo_departamento.dto';
import UpdateInsumoDepartamentoDto from './dtos/update-insumo_departamento.dto';

@Injectable()
export class InsumoDepartamentoService {
  constructor(
    @InjectRepository(InsumoDepartamento)
    private readonly insumoDepartamentoRepository: Repository<InsumoDepartamento>,
  ) { }

  async findAll() {
    // Solo devuelve los insumos que están activos
    return await this.insumoDepartamentoRepository.find({ where: { is_active: true } });
  }

  async findOne(id: string) {
    const insumoDepartamento = await this.insumoDepartamentoRepository.findOne({ where: { id, is_active: true } });
    if (!insumoDepartamento) {
      throw new NotFoundException(`InsumoDepartamento con ID ${id} no encontrado o desactivado`);
    }
    return insumoDepartamento;
  }

  async create(createInsumoDepartamentoDto: CreateInsumoDepartamentoDto) {
    const insumoDepartamento = this.insumoDepartamentoRepository.create(createInsumoDepartamentoDto);
    return await this.insumoDepartamentoRepository.save(insumoDepartamento);
  }

  async update(id: string, updateInsumoDepartamentoDto: UpdateInsumoDepartamentoDto) {
    const insumoDepartamento = await this.findOne(id);
    if (!insumoDepartamento) {
      throw new NotFoundException(`InsumoDepartamento con ID ${id} no encontrado o desactivado`);
    }
    this.insumoDepartamentoRepository.merge(insumoDepartamento, updateInsumoDepartamentoDto);
    return await this.insumoDepartamentoRepository.save(insumoDepartamento);
  }

  async softDelete(id: string) {
    const insumoDepartamento = await this.findOne(id);
    if (!insumoDepartamento) {
      throw new NotFoundException(`InsumoDepartamento con ID ${id} no encontrado o ya desactivado`);
    }
    // Soft delete: cambia el campo `is_active` a false
    insumoDepartamento.is_active = false;
    return await this.insumoDepartamentoRepository.save(insumoDepartamento);
  }
}
