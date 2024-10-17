import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Paciente from './entities/paciente.entity';
import { Repository } from 'typeorm';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import Antecedente from './entities/antecedente.entity';
import UpdatePacienteDto from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>,

    @InjectRepository(Antecedente)
    private readonly antecedentesRepository: Repository<Antecedente>, // Repositorio de antecedentes
  ) {}

  async findAll(query: any) {
    const { q, page = 1, limit = 10 } = query;
    const queryBuilder = this.pacientesRepository
      .createQueryBuilder('paciente')
      .leftJoinAndSelect('paciente.antecedente', 'antecedente')
      .where('paciente.is_active = true')
      .select([
        'paciente.id',
        'paciente.nombre',
        'paciente.sexo',
        'paciente.cui',
        'paciente.nacimiento',
        'paciente.familiares',
        'paciente.medicos',
        'paciente.quirurgicos',
        'paciente.traumaticos',
        'paciente.alergias',
        'paciente.vicios',
        'antecedente.id',
        'antecedente.gestas',
        'antecedente.hijos_vivos',
        'antecedente.hijos_muertos',
        'antecedente.abortos',
        'antecedente.ultima_regla',
        'antecedente.planificacion_familiar',
        'antecedente.partos',
        'antecedente.cesareas',
      ]);

    if (q) {
      queryBuilder.andWhere('paciente.nombre LIKE :nombre', {
        nombre: `%${q}%`,
      });
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
    const paciente = await this.pacientesRepository.findOne({
      where: { id, is_active: true },
      relations: ['antecedente'],
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return paciente;
  }

  async create(createPacienteDto: CreatePacienteDto) {
    const { nombre, sexo, antecedente, ...rest } = createPacienteDto;

    // Crear el paciente
    const paciente = this.pacientesRepository.create({
      nombre,
      sexo,
      ...rest,
    });

    const savedPaciente = await this.pacientesRepository.save(paciente);

    // Solo crear el antecedente si el paciente es de sexo 'Femenino'
    if (sexo === 'Femenino' && antecedente) {
      const nuevoAntecedente = this.antecedentesRepository.create({
        ...antecedente,
        planificacion_familiar: Number(antecedente.planificacion_familiar),
        paciente: savedPaciente, // Relacionar el antecedente con el paciente recién creado
      });
      await this.antecedentesRepository.save(nuevoAntecedente);
    } else if (antecedente) {
      throw new BadRequestException(
        'Solo los pacientes de sexo Femenino pueden tener antecedentes.',
      );
    }

    // Retornar el paciente con o sin antecedente
    const pacienteConAntecedente = await this.findOne(savedPaciente.id);
    return pacienteConAntecedente;
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto) {
    const paciente = await this.findOne(id); // Buscar el paciente
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    const { antecedente, ...updateData } = updatePacienteDto;

    // Actualizar los campos del paciente
    this.pacientesRepository.merge(paciente, updateData);
    await this.pacientesRepository.save(paciente);

    // Verificar si el paciente es de sexo Femenino antes de actualizar o crear el antecedente
    if (paciente.sexo === 'Femenino' && antecedente) {
      // Buscar si ya existe un antecedente para el paciente
      const existingAntecedente = await this.antecedentesRepository.findOne({
        where: { paciente },
      });

      if (existingAntecedente) {
        // Si ya existe un antecedente, actualízalo
        this.antecedentesRepository.merge(existingAntecedente, {
          ...antecedente,
          planificacion_familiar: Number(antecedente.planificacion_familiar),
        });
        await this.antecedentesRepository.save(existingAntecedente);
      } else {
        // Si no existe, crear uno nuevo
        const nuevoAntecedente = this.antecedentesRepository.create({
          ...antecedente,
          planificacion_familiar: Number(antecedente.planificacion_familiar),
          paciente,
        });
        await this.antecedentesRepository.save(nuevoAntecedente);
      }
    } else if (antecedente) {
      // Si el paciente no es de sexo femenino pero se intentan pasar antecedentes, lanzar un error
      throw new BadRequestException(
        'Solo los pacientes de sexo Femenino pueden tener antecedentes.',
      );
    }

    // Retornar el paciente actualizado
    return await this.findOne(id);
  }

  async remove(id: string) {
    const paciente = await this.findOne(id); // Buscar el paciente
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    // Eliminar el antecedente si existe
    if (paciente.antecedente) {
      await this.antecedentesRepository.delete({
        paciente: { id: paciente.id },
      });
    }

    // Eliminar el paciente
    await this.pacientesRepository.delete(id);
    return {
      message: `Paciente y su antecedente (si existía) han sido eliminados`,
    };
  }
}
