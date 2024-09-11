import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Departamento from './entities/departamento.entity';
import CreateDepartamentoDto from './dto/create-departamento.dto';
import UpdateDepartamentoDto from './dto/update-departamento.dto';


@Injectable()
export class DepartamentoService {
    constructor(
        @InjectRepository(Departamento)
        private readonly departamentoRepository: Repository<Departamento>,
    ) {}

    async findAll() {
        return await this.departamentoRepository.find();
    }

    async findOne(id: string) {
        const departamento = await this.departamentoRepository.findOne({ where: { id } });
        if (!departamento) {
            throw new NotFoundException(`Departamento con ID ${id} no encontrado`);
        }
        return departamento;
    }

    async create(createDepartamentoDto: CreateDepartamentoDto) {
        const departamento = this.departamentoRepository.create(createDepartamentoDto);
        return await this.departamentoRepository.save(departamento);
    }

    async update(id: string, updateDepartamentoDto: UpdateDepartamentoDto) {
        const departamento = await this.findOne(id);
        this.departamentoRepository.merge(departamento, updateDepartamentoDto);
        return await this.departamentoRepository.save(departamento);
    }

    async remove(id: string) {
        const departamento = await this.findOne(id);
        return await this.departamentoRepository.remove(departamento);
    }
}
