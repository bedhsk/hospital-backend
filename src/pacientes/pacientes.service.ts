import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Paciente from './entities/paciente.entity';
import { AntecedentesService } from './antecedentes/antecedentes.service';
import { Repository } from 'typeorm';
import CreatePacienteDto from './dto/create-paciente.dto';
import QueryPacienteDto from './dto/query-paciente.dto';
import UpdatePacienteDto from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {

    constructor(
        @InjectRepository(Paciente)
        private readonly pacientesRepository: Repository<Paciente>,

      ) { }

      async findAll(query: QueryPacienteDto) {
        const { q, filter, filterCui, page, limit } = query;
        const queryBuilder = this.pacientesRepository.createQueryBuilder('paciente')
        .leftJoinAndSelect('paciente.antecedentes', 'antecedente')  
        .where({ is_active: true })
          .select([
            'paciente.id',
            'paciente.nombre',
            'paciente.sexo',
            'paciente.cui',
            'paciente.nacimiento',
            'paciente.familiares',
            'paciente.medicos',
            'paciente.traumaticos',
            'paciente.quirurgicos',
            'paciente.alergias',
            'paciente.vicios',
            'paciente.createdAt',
            'antecedente.id', 
            'antecedente.gestas',
            'antecedente.hijos_vivos',
            'antecedente.hijos_muertos',
            'antecedente.abortos',
            'antecedente.ultima_regla',
            'antecedente.planificacion_familiar',
            'antecedente.partos',
            'antecedente.cesareas',
            'antecedente.createdAt',  
          ]);
    
        if (q) {
          queryBuilder.andWhere('paciente.nombre ILIKE :nombre',
            { nombre: `%${q}%` });
            
        }
        if (filter) {
          queryBuilder.andWhere('paciente.sexo = :sexo', { sexo: `${filter}` });
        }
        if (filterCui) {
          queryBuilder.andWhere('paciente.cui LIKE :cui', { cui: `${filterCui}` });
        }
    
        const totalItems = await queryBuilder.getCount();
    
        const pacientes = await queryBuilder
          .skip((page - 1) * limit)
          .take(limit)
          .getMany();
    
        const totalPages = Math.ceil(totalItems / limit);
    
        return {
          data: pacientes,
          totalItems,
          totalPages,
          page,
        };
      }


      

      async findOne(id: string) {
        const record = await this.pacientesRepository.findOne({ where: { id, is_active: true }});
        if (record === null) {
          throw new NotFoundException(`Paciente #${id} no encontrado`);
        }
        return record;
      }
    /**
      async findOneByName(nombre: string) {
        const record = await this.pacientesRepository.findOne({ where: { nombre, is_active: true } });
        if (record === null) {
          throw new NotFoundException(`Paciente  #${nombre} no encontrado`);
        }
        return record;
      }
 
      async findOneByCui(cui: string) {
        const record = await this.pacientesRepository.findOne({ where: { cui, is_active: true }});
        if (record === null) {
          throw new NotFoundException(`Paciente  #${cui} no encontrado`);
        }
        return record;
      }
*/
      async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
        const { cui, ...pacienteData } = createPacienteDto;
        console.log(cui)
        if(cui!==undefined) 
        {
          const existingPaciente = await this.pacientesRepository.findOne({ where: { cui: cui } });
          if (existingPaciente) {
            throw new ConflictException('Este paciente ya se encuetra');
          
          
          }
        }
        const paciente = this.pacientesRepository.create({ ...pacienteData, cui });
        return this.pacientesRepository.save(paciente);


      }
    

      async update(id: string, update_paciente: UpdatePacienteDto) {

        console.log(id)
        console.log("Hola")
        const paciente = await this.findOne(id);

  
        this.pacientesRepository.merge(paciente, update_paciente);
    
        return this.pacientesRepository.save(paciente);
      }


      async remove(id: string) {
        const paciente = await this.findOne(id);
        paciente.is_active = false;
        await this.pacientesRepository.save(paciente);
      }

}
