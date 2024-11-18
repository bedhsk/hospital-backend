import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Paciente from './entities/paciente.entity';
import { Not, Repository } from 'typeorm';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import Antecedente from './entities/antecedente.entity';
import UpdatePacienteDto from './dto/update-paciente.dto';
import { now } from 'moment';

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
      .leftJoinAndSelect('paciente.recetas', 'recetas')
      .leftJoinAndSelect('paciente.ordenesLaboratorio', 'ordenesLaboratorio')
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
        'recetas.id',
        'recetas.descripcion',
        'recetas.estado',
        'ordenesLaboratorio.id',
        'ordenesLaboratorio.descripcion',
        'ordenesLaboratorio.estado',
      ]);

    if (q) {
      queryBuilder.andWhere(
        'unaccent(paciente.nombre) ILIKE unaccent(:nombre) OR paciente.cui ILIKE :cui',
        {
          nombre: `%${q}%`,
          cui: `%${q}%`,
        },
      );
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

  async findHistorialMedico(id: string) {
    const paciente = await this.pacientesRepository
      .createQueryBuilder('paciente')
      .leftJoinAndSelect('paciente.antecedente', 'antecedente')
      .leftJoinAndSelect('paciente.recetas', 'recetas')
      .leftJoinAndSelect('recetas.retiro', 'retiro')
      .leftJoinAndSelect('retiro.detalleRetiro', 'detalleRetiro')
      .leftJoinAndSelect('detalleRetiro.insumoDepartamento', 'insumoDepartamento')
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo')
      .leftJoinAndSelect('insumo.categoria', 'categoria')

      .leftJoinAndSelect('paciente.ordenesLaboratorio', 'ordenesLaboratorio')
      .leftJoinAndSelect('ordenesLaboratorio.retiro', 'retiro2')
      .leftJoinAndSelect('retiro2.detalleRetiro', 'detalleRetiro2')
      .leftJoinAndSelect('detalleRetiro2.insumoDepartamento', 'insumoDepartamento2')
      .leftJoinAndSelect('insumoDepartamento2.insumo', 'insumo2')
      .leftJoinAndSelect('insumo2.categoria', 'categoria2')
      .where('paciente.id = :id', { id })
      .andWhere('paciente.is_active = true')
      .orderBy('recetas.updatedAt', 'DESC')
      .getOne();

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    const retiros = [
      ...paciente.recetas.map((receta) => {
        let insumos = [];
        if (receta.retiro) {
          insumos = receta.retiro.detalleRetiro.map((detalle) => ({
            id: detalle.insumoDepartamento.insumo.id,
            nombre: detalle.insumoDepartamento.insumo.nombre,
            categoria: detalle.insumoDepartamento.insumo.categoria.nombre,
            cantidad: detalle.cantidad,
          }));
        }
        return{
          id: receta.id,
          descripcion: receta.descripcion,
          estado: receta.estado,
          createdAt: receta.createdAt,
          updatedAt: receta.updatedAt,
          tipo: 'Receta', // Identificamos que este es del tipo receta
          insumos: insumos,
        }
      }),
      ...paciente.ordenesLaboratorio.map((orden) => {
        let insumos = [];
        if (orden.retiro) {
          insumos = orden.retiro.detalleRetiro.map((detalle) => ({
            id: detalle.insumoDepartamento.insumo.id,
            nombre: detalle.insumoDepartamento.insumo.nombre,
            categoria: detalle.insumoDepartamento.insumo.categoria.nombre,
            cantidad: detalle.cantidad,
          }));
        }
        return{
          id: orden.id,
          descripcion: orden.descripcion,
          estado: orden.estado,
          createdAt: orden.created_at,
          updatedAt: orden.updated_at,
          tipo: 'Orden de Laboratorio', // Identificamos que este es del tipo ordenLaboratorio
          insumos: insumos,
        }
      }),
    ];

    // Ordenar los retiros por fecha de creación
    retiros.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    const { recetas, ordenesLaboratorio, ...pacienteSinRelaciones } = paciente;

    return { ...pacienteSinRelaciones, retiros };
  }

  async create(createPacienteDto: CreatePacienteDto) {
    const { nombre, nacimiento, sexo, antecedente, cui, ...rest } =
      createPacienteDto;

    // Verificar si el paciente ya existe
    
    
    const pacienteExistente = await this.pacientesRepository.findOne({
      where: { nombre, nacimiento, is_active: true},
    });

    if (pacienteExistente) {
      throw new ConflictException(
        `Ya existe un paciente con el mismo nombre "${nombre}" y fecha de nacimiento.`,
      );
    }

    const pacienteExistentePorCui = await this.pacientesRepository.findOne({
      where: { cui, is_active: true },
    });

    if (pacienteExistentePorCui) {
      throw new ConflictException(`Ya existe un paciente con el CUI "${cui}".`);
    }

    //Verifica Si es un paciente eliminado
    const pacienteEliminado = await this.pacientesRepository.findOne({
      where: { cui, is_active: false },
    });
    if (pacienteEliminado) {
      pacienteEliminado.is_active = true
      this.pacientesRepository.merge(pacienteEliminado, createPacienteDto);
      await this.pacientesRepository.save(pacienteEliminado);
      if (pacienteEliminado.antecedente)
      {
        pacienteEliminado.antecedente.is_active = true
        this.antecedentesRepository.merge(pacienteEliminado.antecedente, createPacienteDto.antecedente);
        
      }
      return pacienteEliminado
    }
   

    // Crear el paciente
    const paciente = this.pacientesRepository.create({
      nombre,
      sexo,
      nacimiento,
      cui,
      ...rest,
    });

    if (sexo === 'Femenino' && antecedente) {
      const nuevoAntecedente = this.antecedentesRepository.create(antecedente);
      paciente.antecedente = nuevoAntecedente;
    } else if (antecedente) {
      throw new BadRequestException(
        'Solo los pacientes de sexo Femenino pueden tener antecedentes.',
      );
    }

    const savedPaciente = await this.pacientesRepository.save(paciente);
    return savedPaciente;
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto) {
    const paciente = await this.findOne(id); // Buscar el paciente
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    const { antecedente, nacimiento, nombre, ...updateData } =
      updatePacienteDto;

    // Verificar si ya existe otro paciente con el mismo nombre y fecha de nacimiento
    if (nombre && nacimiento) {
      const pacienteDuplicado = await this.pacientesRepository.findOne({
        where: {
          nombre,
          nacimiento,
          id: Not(id), // Excluir el paciente actual de la búsqueda
        },
      });

      if (pacienteDuplicado) {
        throw new ConflictException(
          `Ya existe un paciente con el nombre "${nombre}" y fecha de nacimiento.`,
        );
      }
    }

    // Incluir nombre y nacimiento en updateData si están presentes
    const updatedPacienteData = {
      ...updateData,
      ...(nombre && { nombre }),
      ...(nacimiento && { nacimiento }),
    };

    // Actualizar los campos del paciente
    this.pacientesRepository.merge(paciente, updatedPacienteData);
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
          planificacion_familiar: antecedente.planificacion_familiar,
        });
        await this.antecedentesRepository.save(existingAntecedente);
      } else {
        // Si no existe, crear uno nuevo
        const nuevoAntecedente = this.antecedentesRepository.create({
          ...antecedente,
          planificacion_familiar: antecedente.planificacion_familiar,
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

//Eliminar el antecedente si existe
    if (paciente.antecedente) {
     paciente.antecedente.is_active=false
     await this.antecedentesRepository.save(paciente.antecedente);
    }

    // Eliminar el paciente
    paciente.is_active = false
    await this.pacientesRepository.save(paciente);
    return {
      message: `Paciente y su antecedente (si existía) han sido desactivados`,
    };
  }
}
