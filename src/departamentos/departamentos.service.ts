import { Injectable, NotFoundException } from '@nestjs/common';
import CreateDepartamentoDto from './dto/create-departamento.dto';
import UpdateDepartamentoDto from './dto/update-departamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Departamento from './entities/departamento.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private readonly departamentosRepository: Repository<Departamento>,
  ) {}

  create(createDepartamentoDto: CreateDepartamentoDto): Promise<Departamento> {
    const record = this.departamentosRepository.create(createDepartamentoDto);
    return this.departamentosRepository.save(record);
  }

  findAll() {
    return this.departamentosRepository.find();
  }

  async findOne(id: string) {
    const record = await this.departamentosRepository.findOne({
      where: { id, is_Active: true },
    });
    if (record === null) {
      throw new NotFoundException(`Departamento #${id} no encontrado`);
    }
    return record;
  }

  async update(id: string, updateDepartamentoDto: UpdateDepartamentoDto) {
    const depto = await this.findOne(id);
    this.departamentosRepository.merge(depto, updateDepartamentoDto);
    return this.departamentosRepository.save(depto);
  }

  async remove(id: string) {
    const depto = await this.findOne(id);
    depto.is_Active = false;
    await this.departamentosRepository.save(depto);
    return 'Departamento desactivado exitosamente';
  }
}
