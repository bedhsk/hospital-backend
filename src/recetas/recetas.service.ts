import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import CreateRecetaDto from './dto/create-receta.dto';
import UpdateRecetaDto from './dto/update-receta.dto';
import Receta from './entities/receta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PacientesService } from 'src/pacientes/pacientes.service';
import QueryRecetaDto from './dto/query-receta.dto';
import { EstadoReceta } from './enum/estado-receta.enum';
import { ExamenesService } from 'src/examenes/examenes.service';
import CreateExamenDto from 'src/examenes/dtos/create-examen.dto';
import { RetirosService } from 'src/retiros/retiros.service';
import CreateRetiroExamenDto from 'src/retiros/dto/create-retiro-examen.dto';
import { throws } from 'assert';
import RetireRecetaDto from './dto/retire-receta.dto';
import { log } from 'console';
import Categoria from 'src/categorias/entities/categoria.entity';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import { OnEvent } from '@nestjs/event-emitter';
import { PacientDeletedEvent } from 'src/events/pacient-deleted.event';
import { runInThisContext } from 'vm';

@Injectable()
export class RecetasService {
  constructor(
    @InjectRepository(Receta)
    private recetasRepository: Repository<Receta>,
    private readonly usersService: UsersService,
    private readonly pacientesService: PacientesService,
    private readonly examenesService: ExamenesService,
    private readonly retiroService: RetirosService,
    private readonly departamentosService: DepartamentosService,
  ) {}

  async create(createRecetaDto: CreateRecetaDto) {
    const { userId, pacienteId, insumos, estado, ...recetaData } =
      createRecetaDto;
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found, cannot create receta');
    }
    const paciente = await this.pacientesService.findOne(pacienteId);
    if (!paciente) {
      throw new NotFoundException('Paciente not found, cannot create receta');
    }
    const departamento =
      await this.departamentosService.findOneByName('Farmacia');
    if (!departamento) {
      throw new NotFoundException('Departamento Farmacia no encontrado');
    }
    //Asociar la receta a un grupo de insumos
    const insumosPromise: CreateExamenDto = {
      nombre: 'Receta para ' + paciente.nombre,
      insumos: insumos.map((detalle) => {
        return {
          insumoId: detalle.insumoId,
          cantidad: detalle.cantidad,
          uso: detalle.uso,
        };
      }),
      descripcion: 'Receta para ' + paciente.nombre,
    };
    const examen = await this.examenesService.create(insumosPromise);
    let retiro;
    if (estado === EstadoReceta.ENTREGADO) {
      const retiroPromise: CreateRetiroExamenDto = {
        usuarioId: userId,
        departamentoId: departamento.id,
        descripcion: 'Entrega de receta para ' + paciente.nombre,
        examenId: examen.id,
      };
      const retiroAux = await this.retiroService.createByExams(retiroPromise);
      retiro = retiroAux.retiro;
    } else {
      retiro = null;
    }

    const receta = this.recetasRepository.create({
      ...recetaData,
      user,
      paciente,
      estado,
      examen: examen,
      retiro: retiro,
    });

    const savedReceta = await this.recetasRepository.save(receta);

    this.examenesService.desactivate(examen.id);

    const resultReceta = await this.findOnePublic(savedReceta.id);
    // Retornar solo la información necesaria
    return resultReceta;
  }

  async findAll(query: QueryRecetaDto) {
    const { q, filter, page = 1, limit = 10 } = query;
    const queryBuilder = this.recetasRepository
      .createQueryBuilder('receta')
      .leftJoinAndSelect('receta.user', 'user')
      .leftJoinAndSelect('receta.paciente', 'paciente')
      .leftJoinAndSelect('receta.examen', 'examen')
      .innerJoinAndSelect('examen.insumoExamenes', 'insumoExamen')
      .innerJoinAndSelect('insumoExamen.insumo', 'insumo')
      .leftJoinAndSelect('insumo.categoria', 'categoria') // Incluimos la categoría del insumo si es necesario
      .leftJoinAndSelect('receta.retiro', 'retiro')
      .leftJoinAndSelect('retiro.detalleRetiro', 'detalleRetiro')
      .leftJoinAndSelect(
        'detalleRetiro.insumoDepartamento',
        'insumoDepartamento',
      )
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo2')
      .leftJoinAndSelect('insumo2.categoria', 'categoria2')
      .where('receta.is_Active = :isActive', { isActive: true });

    if (q) {
      queryBuilder.andWhere(
        '(unaccent(user.name) ILIKE unaccent(:name) OR unaccent(paciente.nombre) ILIKE unaccent(:nombre) OR paciente.cui ILIKE :cui)',
        { name: `%${q}%`, nombre: `%${q}%`, cui: `%${q}%` },
      );
    }

    if (filter) {
      queryBuilder.andWhere(
        '(unaccent(user.name) = unaccent(:user) OR unaccent(paciente.nombre) = unaccent(:paciente))',
        { user: filter, paciente: filter },
      );
    }

    const totalItems = await queryBuilder.getCount();

    const recetas = await queryBuilder
      .select([
        'receta.id',
        'receta.descripcion',
        'receta.createdAt',
        'receta.estado', // Incluir el campo estado
        'user.id',
        'user.name',
        'paciente.id',
        'paciente.nombre',
        'examen.id',
        'insumoExamen.id',
        'insumoExamen.cantidad',
        'insumoExamen.uso',
        'insumo.id',
        'insumo.nombre',
        'categoria.id',
        'categoria.nombre',
        'retiro.id',
        'retiro.descripcion',
        'retiro.createdAt',
        'detalleRetiro.id',
        'detalleRetiro.cantidad',
        'insumoDepartamento.id',
        'insumo2.id',
        'insumo2.nombre',
        'categoria2.id',
        'categoria2.nombre',
      ])
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);
    const newRecetas = recetas.map((receta) => {
      let retiros = [];
      if (receta.retiro) {
        retiros = receta.retiro.detalleRetiro.map((detalle) => {
          return {
            id: detalle.insumoDepartamento.insumo.id,
            nombre: detalle.insumoDepartamento.insumo.nombre,
            cantidad: detalle.cantidad,
            categoria: {
              id: detalle.insumoDepartamento.insumo.categoria.id,
              nombre: detalle.insumoDepartamento.insumo.categoria.nombre,
            },
          };
        });
      }
      return {
        id: receta.id,
        descripcion: receta.descripcion,
        createdAt: receta.createdAt,
        updatedAt: receta.updatedAt,
        estado: receta.estado,
        user: { id: receta.user.id, name: receta.user.name },
        paciente: { id: receta.paciente.id, nombre: receta.paciente.nombre },
        insumosRecetados: receta.examen.insumoExamenes.map((insumoExamen) => {
          return {
            id: insumoExamen.insumo.id,
            nombre: insumoExamen.insumo.nombre,
            cantidad: insumoExamen.cantidad,
            uso: insumoExamen.uso,
            categoria: {
              id: insumoExamen.insumo.categoria.id,
              nombre: insumoExamen.insumo.categoria.nombre,
            },
          };
        }),
        insumosRetirados: retiros,
      };
    });

    return {
      data: newRecetas,
      totalItems,
      totalPages,
      page,
    };
  }

  async findOne(id: string) {
    const receta = await this.recetasRepository.findOne({
      where: { id, is_Active: true },
      relations: [
        'user',
        'user.departamento',
        'paciente',
        'examen',
        'examen.insumoExamenes',
        'examen.insumoExamenes.insumo',
        'examen.insumoExamenes.insumo.categoria',
      ], // Incluir la relación con el usuario y el paciente
      select: [
        'id',
        'descripcion',
        'createdAt',
        'estado',
        'user',
        'paciente',
        'examen',
      ], // Incluir el campo estado
    });

    if (!receta) {
      throw new NotFoundException(`Receta #${id} no encontrada`);
    }
    return receta;
  }

  async findOnePublic(id: string) {
    const receta = await this.recetasRepository.findOne({
      where: { id, is_Active: true },
      relations: [
        'user',
        'paciente',
        'examen',
        'examen.insumoExamenes',
        'examen.insumoExamenes.insumo',
        'examen.insumoExamenes.insumo.categoria',
        'retiro',
        'retiro.detalleRetiro',
        'retiro.detalleRetiro.insumoDepartamento',
        'retiro.detalleRetiro.insumoDepartamento.insumo',
        'retiro.detalleRetiro.insumoDepartamento.insumo.categoria',
      ], // Incluir la relación con el usuario y el paciente
      select: [
        'id',
        'descripcion',
        'createdAt',
        'estado',
        'user',
        'paciente',
        'examen',
        'retiro',
      ], // Incluir el campo estado
    });

    if (!receta) {
      throw new NotFoundException(`Receta #${id} no encontrada`);
    }
    let retiros = [];
    if (receta.retiro) {
      retiros = receta.retiro.detalleRetiro.map((detalle) => {
        return {
          id: detalle.insumoDepartamento.insumo.id,
          nombre: detalle.insumoDepartamento.insumo.nombre,
          cantidad: detalle.cantidad,
          categoria: {
            id: detalle.insumoDepartamento.insumo.categoria.id,
            nombre: detalle.insumoDepartamento.insumo.categoria.nombre,
          },
        };
      });
    }
    return {
      id: receta.id,
      descripcion: receta.descripcion,
      createdAt: receta.createdAt,
      updatedAt: receta.updatedAt,
      estado: receta.estado,
      user: { id: receta.user.id, name: receta.user.name },
      paciente: { id: receta.paciente.id, nombre: receta.paciente.nombre },
      insumosRecetados: receta.examen.insumoExamenes.map((insumoExamen) => {
        return {
          id: insumoExamen.insumo.id,
          nombre: insumoExamen.insumo.nombre,
          cantidad: insumoExamen.cantidad,
          uso: insumoExamen.uso,
          categoria: {
            id: insumoExamen.insumo.categoria.id,
            nombre: insumoExamen.insumo.categoria.nombre,
          },
        };
      }),
      insumosRetirados: retiros,
    };
  }

  async update(id: string, updateRecetaDto: UpdateRecetaDto) {
    try {
      const receta = await this.findOne(id);
      const { userId, pacienteId, insumos, ...recetaData } = updateRecetaDto;

      if (receta.estado === EstadoReceta.ENTREGADO) {
        throw new BadRequestException(
          'No se puede actualizar una receta con estado Entregado.',
        );
      }

      if (userId) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
          throw new NotFoundException('Usuario no encontrado');
        }
        receta.user = user;
      }

      if (pacienteId) {
        const paciente = await this.pacientesService.findOne(pacienteId);
        if (!paciente) {
          throw new NotFoundException('Paciente no encontrado');
        }
        receta.paciente = paciente;
      }

      recetaData.estado = receta.estado;

      if (insumos) {
        try {
          await this.examenesService.activate(receta.examen.id);

          await this.examenesService.update(receta.examen.id, {
            nombre: `Receta para ${receta.paciente.nombre}`,
            insumos: insumos.map((detalle) => ({
              insumoId: detalle.insumoId,
              cantidad: detalle.cantidad,
              uso: detalle.uso,
            })),
            descripcion: `Receta para ${receta.paciente.nombre}`,
          });

          await this.examenesService.desactivate(receta.examen.id);
        } catch (error) {
          if (error) {
            throw error;
          }
          throw new Error(`Error actualizando examen: ${error.message}`);
        }
      }

      this.recetasRepository.merge(receta, recetaData);
      const savedReceta = await this.recetasRepository.save(receta);

      return this.findOnePublic(savedReceta.id);
    } catch (error) {
      if (error) {
        throw error;
      }
      throw new Error(`Error actualizando receta: ${error.message}`);
    }
  }

  async remove(id: string) {
    const receta = await this.findOne(id);

    // Verificar si el estado es 'Entregado'
    if (receta.estado === EstadoReceta.ENTREGADO) {
      throw new BadRequestException(
        'No se puede eliminar una receta con estado "Entregado".',
      );
    }

    // Realizar el soft delete (cambiar is_Active a false)
    receta.is_Active = false;

    this.examenesService.desactivate(receta.examen.id);
    await this.recetasRepository.save(receta);
  }

  async retiroReceta(id: string, usuario: RetireRecetaDto) {
    const receta = await this.findOne(id);
    if (!receta) {
      throw new NotFoundException('Receta no encontrada');
    }
    const usuarioRetiro = await this.usersService.findOne(usuario.userId);
    if (receta.estado === EstadoReceta.ENTREGADO) {
      throw new BadRequestException('La receta ya ha sido entregada');
    }
    if (!usuarioRetiro) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const departamento =
      await this.departamentosService.findOneByName('Farmacia');
    if (!departamento) {
      throw new NotFoundException('Departamento Farmacia no encontrado');
    }
    receta.estado = EstadoReceta.ENTREGADO;
    this.examenesService.activate(receta.examen.id);
    const retiro = await this.retiroService.createByExams({
      usuarioId: usuarioRetiro.id,
      departamentoId: departamento.id,
      descripcion: 'Entrega de receta para ' + receta.paciente.nombre,
      examenId: receta.examen.id,
    });
    receta.retiro = retiro.retiro;
    this.examenesService.desactivate(receta.examen.id);
    const savedReceta = await this.recetasRepository.save(receta);
    return this.findOnePublic(savedReceta.id);
  }

  @OnEvent('pacient.deleted')
  async handlePacienteDeletedEvent(event: { pacienteId: string }) {
    const { pacienteId } = event;
    const recetas = await this.recetasRepository.find({
      where: { paciente: { id: pacienteId }, is_Active: true },
    });

    recetas.forEach(async (receta) => {
      if (receta.estado === EstadoReceta.PENDIENTE) {
        await this.remove(receta.id);
      }
    });
  }
}
