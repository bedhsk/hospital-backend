import { Injectable, NotFoundException } from '@nestjs/common';
import CreateRecetaDto from './dto/create-receta.dto';
import UpdateRecetaDto from './dto/update-receta.dto';
import Receta from './entities/receta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PacientesService } from 'src/pacientes/pacientes.service';
import QueryRecetaDto from './dto/query-receta.dto';

@Injectable()
export class RecetasService {
  constructor(
    @InjectRepository(Receta)
    private recetasRepository: Repository<Receta>,
    private readonly usersService: UsersService,
    private readonly pacientesService: PacientesService,
  ) {}

  async create(createRecetaDto: CreateRecetaDto): Promise<Receta> {
    const { userId, pacienteId, ...recetaData } = createRecetaDto;
    const user = await this.usersService.findOne(createRecetaDto.userId);
    const paciente = await this.pacientesService.findOne(
      createRecetaDto.pacienteId,
    );

    if (!user) {
      throw new NotFoundException('User not found, cannot create receta');
    }

    if (!paciente) {
      throw new NotFoundException('Paciente not found, cannot create receta');
    }

    const receta = this.recetasRepository.create({
      ...recetaData,
      user,
      paciente,
    });
    return this.recetasRepository.save(receta);
  }

  async findAll(query: QueryRecetaDto) {
    const { q, filter, page, limit } = query;
    const queryBuilder = this.recetasRepository
      .createQueryBuilder('receta')
      .where({ is_Active: true })
      .leftJoinAndSelect('receta.user', 'user')
      .leftJoinAndSelect('receta.paciente', 'paciente')
      .select([
        'receta.id',
        'receta.descripcion',
        'user.id',
        'user.name',
        'paciente.id',
        'paciente.nombre',
      ]);

    if (q) {
      queryBuilder.andWhere('user.name LIKE :name', { name: `${q}` });
    }

    if (filter) {
      queryBuilder.andWhere(
        'user.name = :user OR paciente.nombre = :paciente',
        { user: `${filter}`, paciente: `${filter}` },
      );
    }

    const totalItems = await queryBuilder.getCount();

    const users = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: users,
      totalItems,
      totalPages,
      page,
    };
  }

  async findOne(id: string) {
    const record = await this.recetasRepository.findOne({
      where: { id, is_Active: true },
      relations: ['user', 'paciente'],
    });
    if (record === null) {
      throw new NotFoundException(`Receta #${id} no encontrada`);
    }
    return record;
  }

  async update(id: string, updateRecetaDto: UpdateRecetaDto) {
    const receta = await this.findOne(id);
    const { userId, pacienteId, ...recetaData } = updateRecetaDto;

    // Verificar si se envió un roleId y actualizar solo si se envía
    if (userId) {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException('Role not found, cannot update receta');
      }
      receta.user = user;
    }

    if (pacienteId) {
      const paciente = await this.pacientesService.findOne(pacienteId);
      if (!paciente) {
        throw new NotFoundException('Paciente not found, cannot update receta');
      }
      receta.paciente = paciente;
    }

    // Mergear los otros datos de la receta
    this.recetasRepository.merge(receta, recetaData);

    return this.recetasRepository.save(receta);
  }

  async remove(id: string) {
    const receta = await this.findOne(id);
    receta.is_Active = false;
    await this.recetasRepository.save(receta);
  }
}
