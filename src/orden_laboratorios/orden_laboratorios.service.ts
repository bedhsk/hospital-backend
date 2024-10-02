import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OrdenLaboratorio from './entities/orden_laboratorio.entity';
import CreateOrdenLaboratorioDto from './dtos/create-orden-laboratorio.dto';
import UpdateOrdenLaboratorioDto from './dtos/update-orden-laboratorio.dto';
import QueryOrdenLaboratorioDto from './dtos/query-orden-laboratorio.dto';
import User from '../users/entities/user.entity';
import Paciente from '../pacientes/entities/paciente.entity';
import Examen from '../examenes/entities/examen.entity';
import Retiro from '../retiros/entities/retiro.entity';

@Injectable()
export class OrdenLaboratorioService {
  constructor(
    @InjectRepository(OrdenLaboratorio)
    private readonly ordenLaboratorioRepository: Repository<OrdenLaboratorio>,

    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,

    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,

    @InjectRepository(Examen)
    private readonly examenRepository: Repository<Examen>,

    @InjectRepository(Retiro)
    private readonly retiroRepository: Repository<Retiro>,
  ) {}

  // Método para crear una nueva orden de laboratorio
  async create(createOrdenLaboratorioDto: CreateOrdenLaboratorioDto) {
    const { usuarioId, retiroId, pacienteId, examenId, ...rest } = createOrdenLaboratorioDto;

    // Verifica que el usuario existe
    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    // Verifica que el paciente existe
    const paciente = await this.pacienteRepository.findOne({ where: { id: pacienteId } });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${pacienteId} no encontrado`);
    }

    // Verifica que el examen existe
    const examen = await this.examenRepository.findOne({ where: { id: examenId } });
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${examenId} no encontrado`);
    }

    // Verifica si se proporcionó un ID de retiro y busca el retiro (es opcional)
    let retiro: Retiro | null = null;
    if (retiroId) {
      retiro = await this.retiroRepository.findOne({ where: { id: retiroId } });
    }

    // Crear la nueva orden de laboratorio
    const ordenLaboratorio = this.ordenLaboratorioRepository.create({
      ...rest,
      usuario,
      paciente,
      examen,
      retiro,
    });

    // Guarda y retorna la nueva orden
    return this.ordenLaboratorioRepository.save(ordenLaboratorio);
  }

  // Método para obtener todas las órdenes de laboratorio (con filtros opcionales)
  async findAll(query: QueryOrdenLaboratorioDto) {
    const { q, filter, page, limit } = query;
    const queryBuilder = this.ordenLaboratorioRepository.createQueryBuilder('ordenLaboratorio')
      .where({ is_active: true })
      .leftJoinAndSelect('ordenLaboratorio.usuario', 'usuario')
      .leftJoinAndSelect('ordenLaboratorio.paciente', 'paciente')
      .leftJoinAndSelect('ordenLaboratorio.examen', 'examen')
      .leftJoinAndSelect('ordenLaboratorio.retiro', 'retiro');

    // Aplicar filtro de búsqueda (si se proporciona)
    if (q) {
      queryBuilder.andWhere('paciente.nombre LIKE :nombre', { nombre: `%${q}%` });
    }

    // Aplicar filtro por estado (si se proporciona)
    if (filter) {
      queryBuilder.andWhere('ordenLaboratorio.estado = :estado', { estado: filter });
    }

    const totalItems = await queryBuilder.getCount();
    const ordenesLaboratorio = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: ordenesLaboratorio,
      totalItems,
      totalPages,
      page,
    };
  }

  // Método para obtener una única orden de laboratorio por ID
  async findOne(id: string) {
    const ordenLaboratorio = await this.ordenLaboratorioRepository.findOne({
      where: { id, is_active: true },
      relations: ['usuario', 'paciente', 'examen', 'retiro'],
    });

    if (!ordenLaboratorio) {
      throw new NotFoundException(`Orden de laboratorio con ID ${id} no encontrada`);
    }

    return ordenLaboratorio;
  }

  // Método para actualizar una orden de laboratorio
  async update(id: string, updateOrdenLaboratorioDto: UpdateOrdenLaboratorioDto) {
    const ordenLaboratorio = await this.findOne(id);

    // Actualiza los campos de la orden de laboratorio
    this.ordenLaboratorioRepository.merge(ordenLaboratorio, updateOrdenLaboratorioDto);

    return this.ordenLaboratorioRepository.save(ordenLaboratorio);
  }

  // Método para eliminar (soft delete) una orden de laboratorio
  async softDelete(id: string) {
    const ordenLaboratorio = await this.findOne(id);

    // Soft delete: Cambia el campo `is_active` a false
    ordenLaboratorio.is_active = false;

    return this.ordenLaboratorioRepository.save(ordenLaboratorio);
  }
}
