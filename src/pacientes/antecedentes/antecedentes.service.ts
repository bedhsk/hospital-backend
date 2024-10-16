import { Injectable, NotFoundException } from '@nestjs/common';
import CreateAntecedenteDto from '../dto/create-antecedente.dto';
import Antecedente from '../entities/antecedente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacientesService } from '../pacientes.service';
import QueryAntecedenteDto from '../dto/query-antecedente.dto';
import UpdateAntecedenteDto from '../dto/update-antecedente.dto';

@Injectable()
export class AntecedentesService {
  constructor(
    @InjectRepository(Antecedente)
    private readonly antecedentesRepository: Repository<Antecedente>,  // Inyectar el repositorio de Antecedente
    private readonly pacientesService: PacientesService,  // Inyectar el servicio de Pacientes
  ) { }


  async findAll(query: QueryAntecedenteDto) {
    const { filter, filterCui, filterId, page = 1, limit = 10 } = query;

    const queryBuilder = this.antecedentesRepository.createQueryBuilder('antecedente')
      .leftJoinAndSelect('antecedente.paciente', 'paciente')
      .select([
        'antecedente.id',
        'paciente.id',
        'paciente.nombre',
        'paciente.cui',
        'antecedente.createdAt',
        'antecedente.gestas',
        'antecedente.hijos_vivos',
        'antecedente.hijos_muertos',
        'antecedente.abortos',
        'antecedente.ultima_regla',
        'antecedente.planificacion_familiar',
        'antecedente.partos',
        'antecedente.cesareas',
      ]);

    if (filter) {
      queryBuilder.andWhere('paciente.name = :filterName', { filterName: filter });
    }

    if (filterCui) {
      queryBuilder.andWhere('paciente.cui = :filterCui', { filterCui });
    }

    if (filterId) {
      queryBuilder.andWhere('paciente.id = :filterId', { filterId });
    }

    const totalItems = await queryBuilder.getCount();
    const antecedentes = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: antecedentes,
      totalItems,
      totalPages,
      page,
    };
  }


  async create(createAntecedenteDto: CreateAntecedenteDto): Promise<Antecedente> {
    const { pacienteId, ...userData } = createAntecedenteDto;
    const paciente = await this.pacientesService.findOne(createAntecedenteDto.pacienteId);


    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    if (paciente.sexo !== 'Femenino') {
      throw new NotFoundException('Esta Persona no puede tener antecedentes ginecológicos');
    }

    const antecedente = this.antecedentesRepository.create({ ...userData, paciente });
    return this.antecedentesRepository.save(antecedente);
  }


  async findOne(id: string) {
    const record = await this.antecedentesRepository.findOne({ where: { id }, relations: ['paciente'] });
    if (record === null) {
      throw new NotFoundException(`Antecedente  #${id} no encontrado`);
    }
    return record;
  }

  async update(id: string, update_antecedente: UpdateAntecedenteDto) {
    const antecedente = await this.findOne(id);
    const { pacienteId, ...userData } = update_antecedente;

    if (pacienteId) {
      const paciente = await this.pacientesService.findOne(pacienteId);
      if (!paciente) {
        throw new NotFoundException('Paciente no encontrado');
      }
      if (paciente.sexo !== 'Femenino') {
        throw new NotFoundException('Esta Persona no puede tener antecedentes ginecológicos');
      }
      antecedente.paciente = paciente;
    }

    this.antecedentesRepository.merge(antecedente, userData);

    return this.antecedentesRepository.save(antecedente);
  }

  // Nueva función remove
  async remove(id: string): Promise<void> {
    const antecedente = await this.findOne(id); // Verificar si el antecedente existe
    if (!antecedente) {
      throw new NotFoundException(`Antecedente #${id} no encontrado`);
    }

    // Eliminar el antecedente de la base de datos
    await this.antecedentesRepository.remove(antecedente);
  }
}
