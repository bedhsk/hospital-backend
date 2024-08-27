import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Medicamento from './entities/medicamento.entity';
import { Not, Repository } from 'typeorm';
import UpdateMedicamentoDto from './dtos/update-medicamento.dto';
import CreateMedicamentoDto from './dtos/create-medicamento.dto';

@Injectable()
export class MedicamentosService {
    private recordMedicamentos =[];

    constructor(
        @InjectRepository(Medicamento)
        private readonly medicamentoRepository: Repository<Medicamento>,
    ){}

    findAll(){
        return this.medicamentoRepository.find();
    }

    async findOne(id: number){
        const record = await this.medicamentoRepository.findOne({where: {id}});

        if (record ===null){
            throw new NotFoundException(`Registro con id ${id} no encontrado`);
        }
        return record;
    }

    async update(id: number, update_medicamento: UpdateMedicamentoDto){
        const medicamento = await this.findOne(id);

        this.medicamentoRepository.merge(medicamento, update_medicamento);

        return this.medicamentoRepository.save(medicamento);
    }

    create(new_medicamento: CreateMedicamentoDto){
        const medicamento = this.medicamentoRepository.create(new_medicamento);
        return this.medicamentoRepository.save(medicamento);
    }

    async remove(id: number){
        const medicamento = await this.findOne(id);
        return this.medicamentoRepository.remove(medicamento);
    }
}
