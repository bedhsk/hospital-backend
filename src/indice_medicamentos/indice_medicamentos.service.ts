import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import IndiceMedicamento from './entities/indice_medicamento.entity';
import { Repository } from 'typeorm';
import CreateIndiceMedicamentoDto from './dtos/create-indice-medicamento.dto';
import UpdateIndiceMedicamentoDto from './dtos/update-indice-medicamento.dto';

@Injectable()
export class IndiceMedicamentosService {
    private recordIndiceMedicamentos =[];

    constructor(
        @InjectRepository(IndiceMedicamento)
        private readonly indiceMedicamentoRepository: Repository<IndiceMedicamento>,
    ){}

    findAll(){
        return this.indiceMedicamentoRepository.find();
    }

    async findOne(id: number){
        const record = await this.indiceMedicamentoRepository.findOne({where: {id}});

        if (record ===null){
            throw new NotFoundException(`Registro con id ${id} no encontrado`);
        }
        return record;
    }

    async update(id: number, update_indice_medicamento: UpdateIndiceMedicamentoDto){
        const indice_medicamento = await this.findOne(id);

        this.indiceMedicamentoRepository.merge(indice_medicamento, update_indice_medicamento);

        return this.indiceMedicamentoRepository.save(indice_medicamento);
    }

    create(new_indice_medicamento : CreateIndiceMedicamentoDto){
        const indice_medicamento = this.indiceMedicamentoRepository.create(new_indice_medicamento);
        return this.indiceMedicamentoRepository.save(indice_medicamento);
    }

    async remove(id: number){
        const indice_medicamento = await this.findOne(id);
        return this.indiceMedicamentoRepository.remove(indice_medicamento);
    }
}
