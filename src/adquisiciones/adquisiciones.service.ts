import { Injectable, NotFoundException } from '@nestjs/common';
import Adquisicion from './entities/adquisicion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateAdquisicionDto from './dtos/create-adquisicion.dto';
import { UsersService } from 'src/users/users.service';
import UpdateAdquisicionDto from './dtos/update-adquisicion.dto';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';
import { DetalleadquisicionesService } from './detalleadquisiciones/detalleadquisiciones.service';
import QueryAdquisicionDto from './dtos/query-adquisicion.dto';

@Injectable()
export class AdquisicionesService {
  constructor(
    @InjectRepository(Adquisicion)
    private readonly adquisicionRepository: Repository<Adquisicion>,
    private readonly detalleAdquisicionService: DetalleadquisicionesService,
    private readonly usuarioService: UsersService,
    private readonly insumoDepartamentoService: InsumoDepartamentosService,
  ) {}

  // Método para obtener todos los insumos que están activos
  async findAll(query: QueryAdquisicionDto) {
    const { q, filter, page, limit } = query;
    const queryBuilder = this.adquisicionRepository
      .createQueryBuilder('adquisicion')
      .leftJoinAndSelect('adquisicion.usuario', 'usuario')
      .leftJoinAndSelect('adquisicion.detalleAdquisicion', 'detalleAdquisicion')
      .leftJoinAndSelect('detalleAdquisicion.insumoDepartamento', 'insumoDepartamento')
      .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
      .where('adquisicion.is_active = true')
      .select([
        'adquisicion', // Todos los campos de adquisicion
        'usuario.id', 'usuario.username', // Solo ID y username del usuario
        'detalleAdquisicion.id', 'detalleAdquisicion.cantidad', // Solo ID y cantidad del detalle de adquisición
        'insumoDepartamento.id', 'insumoDepartamento.existencia', // Solo ID y existencia y nombre del insumoDepartamento
        'departamento.id', 'departamento.nombre', // Id y nombre del departamento.
      ])

    if (q) {
      queryBuilder.andWhere('usuario.username LIKE :username', { username: `%${q}%` });
    }

    if (filter) {
      queryBuilder.andWhere('departamento.nombre = :departamento', {
        departamento: `${filter}`,
      });
    }

    const totalItems = await queryBuilder.getCount();
    const insumos = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: insumos,
      totalItems,
      totalPages,
      page,
    };
  }

  // Método para obtener una sola adquisicion por ID si está activa
  async findOne(id: string) {
    const adquisicion = await this.adquisicionRepository
      .createQueryBuilder('adquisicion')
      .leftJoinAndSelect('adquisicion.usuario', 'usuario')
      .leftJoinAndSelect('adquisicion.detalleAdquisicion', 'detalleAdquisicion')
      .leftJoinAndSelect('detalleAdquisicion.insumoDepartamento', 'insumoDepartamento')
      .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
      .where('adquisicion.id = :id', { id })
      .andWhere('adquisicion.is_active = true')
      .select([
        'adquisicion', // Todos los campos de adquisicion
        'usuario.id', 'usuario.username', // Solo ID y username del usuario
        'detalleAdquisicion.id', 'detalleAdquisicion.cantidad', // Solo ID y cantidad del detalle de adquisición
        'insumoDepartamento.id', 'insumoDepartamento.existencia', // Solo ID y existencia y nombre del insumoDepartamento
        'departamento.id', 'departamento.nombre', // Id y nombre del departamento.
      ])
      .getOne();
  
    if (!adquisicion) {
      throw new NotFoundException(
        `Adquisición con ID ${id} no encontrada o desactivada`,
      );
    }
  
    return adquisicion;
  }

  // Crear adquisicion
  async create(createAdquisicion: CreateAdquisicionDto) {
    const { usuarioId, insumoDepartamentoId, ...rest } = createAdquisicion;
    const usuario = await this.usuarioService.findOne(
      createAdquisicion.usuarioId,
    );

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con id ${usuarioId} no encontrado`,
      );
    }

    const insumoDepartamento = await this.insumoDepartamentoService.findOne(
      createAdquisicion.insumoDepartamentoId,
    );

    if (!insumoDepartamento) {
      throw new NotFoundException(
        `Insumo departamento con id ${insumoDepartamentoId} no encontrado`,
      );
    }

    // Crear la nueva adquisicion con el usuario relacionado
    const adquisicionCreate = this.adquisicionRepository.create({
      ...rest,
      usuario: {id: usuario.id, username: usuario.username}, // Relacionar el insumo con la categoría encontrada
    });
    // Guarda la adquisicion 
    const adquisicion = await this.adquisicionRepository.save(adquisicionCreate)

    if (!adquisicion) {
      throw new NotFoundException(
        `Adquisicion no fue creada con exito!`,
      );
    }
    
    if (adquisicion) {
      // Actualizar la existencia del insumo departamento
      await this.insumoDepartamentoService.update(
        insumoDepartamento.id,
        {
          existencia: insumoDepartamento.existencia + createAdquisicion.cantidad 
        }
      );
    }
    // Crear el detalle con la cantidad y insumo departamento relacionado
    const detalleAdquisicion = await this.detalleAdquisicionService.create({
      adquisicionId: adquisicion.id,
      insumoDepartamentoId: insumoDepartamentoId,
      is_active: true,
      cantidad: createAdquisicion.cantidad,
    })

    return {adquisicion, detalleAdquisicion};
  }

  // Actualizar una adquisicion existente, si está activa
  async update(id: string, updateInsumoDto: UpdateAdquisicionDto) {
    const adquisicion = await this.findOne(id);
    if (!adquisicion) {
      throw new NotFoundException(
        `Adquisicion con ID ${id} no encontrado o desactivado`,
      );
    }
    if(updateInsumoDto.descripcion){
      this.adquisicionRepository.merge(adquisicion, {descripcion: updateInsumoDto.descripcion});
    }
    if(updateInsumoDto.cantidad){
      const detalleAdquisicionAux = await this.detalleAdquisicionService.findOneByAdquisicionId(id)
      await this.detalleAdquisicionService.update(detalleAdquisicionAux.id, {cantidad: updateInsumoDto.cantidad})
    }
    return await this.adquisicionRepository.save(adquisicion);
  }

  // Realiza el soft delete cambiando el campo is_active a false
  async softDelete(id: string) {
    const adquisicionAux = await this.findOne(id);
    if (!adquisicionAux) {
      throw new NotFoundException(
        `Adquisicion con ID ${id} no encontrado o ya desactivado`,
      );
    }
    // Cambiamos el campo is_active a false para realizar el soft delete
    adquisicionAux.is_active = false;
    const adquisicion = await this.adquisicionRepository.save(adquisicionAux);

    const detalleAdquisicionAux = await this.detalleAdquisicionService.findOneByAdquisicionId(id)
    if(detalleAdquisicionAux){
      const insumoDepartamento = await this.insumoDepartamentoService.findOne(detalleAdquisicionAux.insumoDepartamento.id)
      // Actualizar la existencia del insumo departamento
      await this.insumoDepartamentoService.update(
        insumoDepartamento.id,
        {
          existencia: insumoDepartamento.existencia - detalleAdquisicionAux.cantidad
        }
      );
    }
    const detalleAdquisicion = await this.detalleAdquisicionService.softDelete(detalleAdquisicionAux.id)
    return {adquisicion, detalleAdquisicion}
  }
}
