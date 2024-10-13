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
        'detalleAdquisicion.id', 'detalleAdquisicion.cantidad', 'detalleAdquisicion.is_active', // Solo ID y cantidad del detalle de adquisición
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
        'detalleAdquisicion.id', 'detalleAdquisicion.cantidad', 'detalleAdquisicion.is_active', // Solo ID y cantidad del detalle de adquisición
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
    const { usuarioId, detalles, ...rest} = createAdquisicion;
    const usuario = await this.usuarioService.findOne(
      createAdquisicion.usuarioId,
    );

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con id ${usuarioId} no encontrado`,
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

    const detallePromises = detalles.map(async element => {
      const { insumoDepartamentoId, cantidad } = element;

      return await this.detalleAdquisicionService.create({
        adquisicionId: adquisicion.id,
        insumoDepartamentoId,
        is_active: true,
        cantidad,
      });
    });

    await Promise.all(detallePromises);

    const detalleAdquisicion = await this.detalleAdquisicionService.findAllByAdquisicionId(adquisicion.id);
    
    return {adquisicion, detalleAdquisicion};
  }

  // Actualizar una adquisicion existente, si está activa
  async update(id: string, updateInsumoDto: UpdateAdquisicionDto) {
    const adquisicionAux = await this.findOne(id);
    if (!adquisicionAux) {
      throw new NotFoundException(
        `Adquisicion con ID ${id} no encontrado o desactivado`,
      );
    }

    if(updateInsumoDto.descripcion){
      this.adquisicionRepository.merge(adquisicionAux, {descripcion: updateInsumoDto.descripcion});
      await this.adquisicionRepository.save(adquisicionAux);
    }
    
    const detallePromises = updateInsumoDto.detalles.map(async element => {
      if (element.cantidad) {
        const detalleAdquisicionAux = await this.detalleAdquisicionService.findOneByAdquisicionIdAndInsumoDepartamentoId(id, element.insumoDepartamentoId)
        await this.detalleAdquisicionService.update(detalleAdquisicionAux.id, { cantidad: element.cantidad })
      }
    });
    
    await Promise.all(detallePromises);

    return await this.findOne(id);
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

    const detallesAdquisicion = await this.detalleAdquisicionService.findAllByAdquisicionId(adquisicionAux.id)
    const detallePromises = detallesAdquisicion.map(async element => {
      await this.detalleAdquisicionService.softDelete(element.id)
    });
    
    await Promise.all(detallePromises);

    return await this.adquisicionRepository.save(adquisicionAux);
  }
}
