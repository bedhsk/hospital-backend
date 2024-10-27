import { Injectable, NotFoundException } from '@nestjs/common';
import Adquisicion from './entities/adquisicion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import CreateAdquisicionDto from './dtos/create-adquisicion.dto';
import { UsersService } from 'src/users/users.service';
import UpdateAdquisicionDto from './dtos/update-adquisicion.dto';
import { DetalleadquisicionesService } from './detalleadquisiciones/detalleadquisiciones.service';
import QueryAdquisicionDto from './dtos/query-adquisicion.dto';
import { LotesService } from 'src/lotes/lotes.service';
import CreateAdquisicionLoteDto from './dtos/create-adquisicion-lote.dto';
import { MovimientolotesService } from 'src/lotes/movimientolotes/movimientolotes.service';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';
import Lote from 'src/lotes/entities/lote.entity';
import createNewLoteDto from './dtos/create-new-lote.dto';
import { log } from 'console';

@Injectable()
export class AdquisicionesService {
  constructor(
    @InjectRepository(Adquisicion)
    private readonly adquisicionRepository: Repository<Adquisicion>,
    private readonly detalleAdquisicionService: DetalleadquisicionesService,
    private readonly usuarioService: UsersService,
    private readonly lotesService: LotesService,
    private readonly movimientoLoteService: MovimientolotesService,
    private readonly departamentosServcie: DepartamentosService,
    private readonly insumoDepartamentoService: InsumoDepartamentosService,
    private dataSource: DataSource,
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
    const { usuarioId, detalles, lotes, ...rest} = createAdquisicion;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
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
      usuario: {id: usuario.id, username: usuario.username},
    });
    // Guarda la adquisicion 
    const adquisicion = await this.adquisicionRepository.save(adquisicionCreate)

    if (!adquisicion) {
      throw new NotFoundException(
        `Adquisicion no fue creada con exito!`,
      );
    }
    
      const detallePromises = detalles.map(async element => {
        const { insumoId, cantidad } = element;
        const insumoDepartamento = await this.insumoDepartamentoService.findOneByInsumoAndDepartamento(insumoId, rest.departamentoId, true);
        const detalle = await this.detalleAdquisicionService.create({
          adquisicionId: adquisicion.id,
          insumoDepartamentoId: insumoDepartamento.id,
          is_active: true,
          cantidad,
        });
        await queryRunner.manager.save(detalle);

        if (lotes) {
          for (const lote of lotes) {
            if (lote.insumoId === insumoId) {
              await this.crearMovimientoLote(insumoDepartamento.id, lote, detalle.id);
            }
          }
        }
        return detalle;
      });

      await Promise.all(detallePromises);
      await queryRunner.commitTransaction();

      const detalleAdquisicion = await this.detalleAdquisicionService.findAllByAdquisicionId(adquisicion.id);
    
      return {adquisicion, detalleAdquisicion};
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
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
        const insumoDepartamento = await this.insumoDepartamentoService.findByInsumoDepartamentoId(element.insumoId, updateInsumoDto.departamentoId);
        const detalleAdquisicionAux = await this.detalleAdquisicionService.findOneByAdquisicionIdAndInsumoDepartamentoId(id, insumoDepartamento.id);
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


  //--------------- CODIGO PARA REALIZAR ADQUISICIONES DE LOTES ----------------------------------//
  async createAdquisicionLote(createAdquisicionLote: CreateAdquisicionLoteDto){
    const { usuarioId, descripcion, lotes} = createAdquisicionLote
    const detalles = []
    const lotesAux = []
    const movimientosLote = []
    const departamento = await this.departamentosServcie.findOneByName('Bodega')
    const lotesPromises = lotes.map(async element => {
      const { insumoId, cantidadInical } = element;
      
      const insumoDepartamento = await this.insumoDepartamentoService.findOneByInsumoAndDepartamento(insumoId, departamento.id, true)
      
      detalles.push({insumoId: insumoId, cantidad: cantidadInical})

      
      const lote = await this.lotesService.create(
        {
          numeroLote: element.numeroLote,
          fechaCaducidad: element.fechaCaducidad,
          cantidadInical: element.cantidadInical,
          status: 'disponible',
          is_active: true,
          insumoDepartamentoId: insumoDepartamento.id,
          cantidadActual: element.cantidadInical
        }
      )
      if (lote){
        lotesAux.push(lote)
      }
      return lote
    });
    
    await Promise.all(lotesPromises);
    const adquisiciones = await this.create({usuarioId, departamentoId: departamento.id, descripcion, detalles, lotes: null})

    const movimientoLotePromises = adquisiciones.detalleAdquisicion.map(async (element, index) => {
      const { id, cantidad } = element;
      const movimientoLoteAux = await this.movimientoLoteService.create({
        loteId: lotesAux[index].id,
        detalleAdquisicionId: id,
        cantidad
      })
      if (movimientoLoteAux){
        movimientosLote.push(movimientoLoteAux)
      }
      return movimientoLoteAux
    });

    await Promise.all(movimientoLotePromises);

    return { 
      adquisicion: adquisiciones.adquisicion, 
      detalleAdquisicion: adquisiciones.detalleAdquisicion , 
      lotes: lotesAux, 
      movimientosLote
    };
  }

  async crearMovimientoLote(
    insumoDepartamentoId: string,
    lote: createNewLoteDto,
    detalleAquisicionId: string,
  ) {
    const loteAd = await this.lotesService.updateAdquisicionLote(lote, insumoDepartamentoId);

    // se crea un movimiento lote.
    return await this.movimientoLoteService.create({
      loteId: loteAd.id,
      detalleAdquisicionId: detalleAquisicionId,
      cantidad: loteAd.cantidadInical,
    });
  }
}
