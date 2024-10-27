import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Retiro from './entities/retiro.entity';
import { Repository } from 'typeorm';
import { DetalleretirosService } from './detalleretiros/detalleretiros.service';
import { UsersService } from 'src/users/users.service';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';
import QueryRetiroDto from './dto/query-retiro.dto';
import CreateRetiroDto, { DetalleRetiroDto } from './dto/create-retiro.dto';
import UpdateRetiroDto from './dto/update-retiro.dto';
import CreateTransaccionDepartamentoDto from './dto/transaccion_departamento.dto';
import { DetalleAdquisicionDto } from 'src/adquisiciones/dtos/create-adquisicion.dto';
import { AdquisicionesService } from 'src/adquisiciones/adquisiciones.service';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import { LotesService } from 'src/lotes/lotes.service';
import { MovimientolotesService } from 'src/lotes/movimientolotes/movimientolotes.service';
import { createNewLoteDto } from 'src/lotes/dto/create-new-lote.dto';
import { log } from 'console';

@Injectable()
export class RetirosService {
  constructor(
    @InjectRepository(Retiro)
    private readonly retiroRepository: Repository<Retiro>,
    private readonly detalleRetiroService: DetalleretirosService,
    private readonly usuarioService: UsersService,
    private readonly insumoDepartamentoService: InsumoDepartamentosService,
    private readonly adquisicionService: AdquisicionesService,
    private readonly departamentoService: DepartamentosService,
    private readonly lotesService: LotesService,
    private readonly moviemintoLoteService: MovimientolotesService,
  ) {}

  async findAll(query: QueryRetiroDto) {
    const { q, filterDepartamento, page, limit } = query;
    const queryBuilder = this.retiroRepository
      .createQueryBuilder('retiro')
      .leftJoinAndSelect('retiro.user', 'user')
      .leftJoinAndSelect('retiro.detalleRetiro', 'detalleRetiro')
      .leftJoinAndSelect(
        'detalleRetiro.insumoDepartamento',
        'insumoDepartamento',
      )
      .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
      .where('retiro.is_active = true')
      .select([
        'retiro', // Todos los campos de Retiro
        'user.id',
        'user.username', // Solo ID y username del usuario
        'detalleRetiro.id',
        'detalleRetiro.cantidad', // Solo ID y cantidad del detalle de reitro
        'insumoDepartamento.id',
        'insumoDepartamento.existencia', // Solo ID y existencia y nombre del insumoDepartamento
        'departamento.id',
        'departamento.nombre', // Id y nombre del departamento.
      ]);

    if (q) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${q}%`,
      });
    }

    if (filterDepartamento) {
      queryBuilder.andWhere('departamento.nombre = :departamento', {
        departamento: `${filterDepartamento}`,
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

  async findOne(id: string) {
    const retiro = await this.retiroRepository
      .createQueryBuilder('retiro')
      .leftJoinAndSelect('retiro.user', 'user')
      .leftJoinAndSelect('retiro.detalleRetiro', 'detalleRetiro')
      .leftJoinAndSelect(
        'detalleRetiro.insumoDepartamento',
        'insumoDepartamento',
      )
      .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
      .where('retiro.id = :id', { id })
      .andWhere('retiro.is_active = true')
      .select([
        'retiro', // Todos los campos de Retiro
        'user.id',
        'user.username', // Solo ID y username del usuario
        'detalleRetiro.id',
        'detalleRetiro.cantidad',
        'detalleRetiro.is_active', // Solo ID y cantidad del detalle de Retiro
        'insumoDepartamento.id',
        'insumoDepartamento.existencia', // Solo ID y existencia y nombre del insumoDepartamento
        'departamento.id',
        'departamento.nombre', // Id y nombre del departamento.
      ])
      .getOne();

    if (!retiro) {
      throw new NotFoundException(
        `Retiro con ID ${id} no encontrada o desactivada`,
      );
    }

    return retiro;
  }

  async create(createRetiro: CreateRetiroDto) {
    const lotesR:createNewLoteDto[] = [];
    const { usuarioId, detalles, ...rest } = createRetiro;
    const usuario = await this.usuarioService.findOne(createRetiro.usuarioId);

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${usuarioId} no encontrado`);
    }

    const retiroCreate = this.retiroRepository.create({
      ...rest,
      user: { id: usuario.id, username: usuario.username },
    });

    const retiro = await this.retiroRepository.save(retiroCreate);

    if (!retiro) {
      throw new NotFoundException(`Retiro no fue creada con exito!`);
    }

    for (const elemntcheck of detalles) {
      try {
        const { insumoDepartamentoId, cantidad } = elemntcheck;
        const insumoDepartamento =
          await this.insumoDepartamentoService.findOne(insumoDepartamentoId);

        if (insumoDepartamento.existencia < cantidad) {
          throw new NotFoundException(
            `Insumo departamento con id ${insumoDepartamento.id} no cuenta con la cantidad en existencia (${insumoDepartamento.existencia}) que se necesita para crear el retiro (${cantidad})`,
          );
        }
      } catch (error) {
        throw error;
      }
    }

    const detallePromises = detalles.map(async (element) => {
      const { insumoDepartamentoId, cantidad } = element;

      const detalle = await this.detalleRetiroService.create({
        retiroId: retiro.id,
        insumoDepartamentoId,
        cantidad,
      });
      // crear el movimiento lote
      const lote = await this.crearMovimientoLote(
        insumoDepartamentoId,
        detalle.cantidad,
        detalle.id,
      );
      lotesR.push(...lote);
      return {detalle, lotesR};
    });

    const lotes = await Promise.all(detallePromises);

    const detalleRetiro = await this.detalleRetiroService.findAllRetiroId(
      retiro.id,
    );

    return { retiro, detalleRetiro, lotesR};
  }

  async update(id: string, updateInsumoDto: UpdateRetiroDto) {
    const retiroAux = await this.findOne(id);
    if (!retiroAux) {
      throw new NotFoundException(
        `Retiro con ID ${id} no encontrado o desactivado`,
      );
    }
    if (updateInsumoDto.descripcion) {
      this.retiroRepository.merge(retiroAux, {
        descripcion: updateInsumoDto.descripcion,
      });
      await this.retiroRepository.save(retiroAux);
    }

    for (const elemntcheck of updateInsumoDto.detalles) {
      try {
        const { insumoDepartamentoId, cantidad } = elemntcheck;
        const insumoDepartamento =
          await this.insumoDepartamentoService.findOne(insumoDepartamentoId);

        if (insumoDepartamento.existencia < cantidad) {
          throw new NotFoundException(
            `Insumo departamento con id ${insumoDepartamento.id} no cuenta con la cantidad en existencia (${insumoDepartamento.existencia}) que se necesita para actualizar el retiro (${cantidad})`,
          );
        }
      } catch (error) {
        throw error;
      }
    }

    const detallePromises = updateInsumoDto.detalles.map(async (element) => {
      if (element.cantidad) {
        const detalleRetiroAux =
          await this.detalleRetiroService.findOneByRetiroIdAndInsumoDepartamentoId(
            id,
            element.insumoDepartamentoId,
          );
        await this.detalleRetiroService.update(detalleRetiroAux.id, {
          cantidad: element.cantidad,
        });
      }
    });

    await Promise.all(detallePromises);

    return await this.findOne(id);
  }

  async softDelete(id: string) {
    const retiroAux = await this.findOne(id);
    if (!retiroAux) {
      throw new NotFoundException(
        `Retiro con ID ${id} no encontrado o ya desactivado`,
      );
    }
    // Cambiamos el campo is_active a false para realizar el soft delete
    retiroAux.is_active = false;

    const detallesRetiro = await this.detalleRetiroService.findAllRetiroId(
      retiroAux.id,
    );
    const detallePromises = detallesRetiro.map(async (element) => {
      await this.detalleRetiroService.softDelete(element.id);
    });

    await Promise.all(detallePromises);

    return await this.retiroRepository.save(retiroAux);
  }

  async transaccionDepartamento(transaccion: CreateTransaccionDepartamentoDto) {
    const {
      departamentoAdquisicionId,
      departamentoRetiroId,
      usuarioId,
      insumos,
    } = transaccion;
    const detalleRetirosPromise = insumos.map(async (element) => {
      const { insumoId, cantidad } = element;
      const insumoDepartamento =
        await this.insumoDepartamentoService.findByInsumoDepartamentoId(
          insumoId,
          departamentoRetiroId,
        );
      if (!insumoDepartamento) {
        throw new NotFoundException(
          `Insumo ${insumoId} no encontrado en el departamento ${departamentoRetiroId}`,
        );
      }
      if (insumoDepartamento.existencia < cantidad) {
        throw new NotFoundException(
          `Insumo ${insumoDepartamento.insumo.nombre} no tiene suficiente existencia`,
        );
      }
      return {
        insumoDepartamentoId: insumoDepartamento.id,
        cantidad: cantidad,
      };
    });
    const detalleRetiros: DetalleRetiroDto[] = await Promise.all(
      detalleRetirosPromise,
    );

    // const detalleAdquisicionPromise = insumos.map(async (element) => {
    //   const { insumoId, cantidad } = element;
    //   const insumoDepartamento =
    //     await this.insumoDepartamentoService.findOneByInsumoAndDepartamento(
    //       insumoId,
    //       departamentoAdquisicionId,
    //     );
    //   if (!insumoDepartamento) {
    //     throw new NotFoundException(
    //       `Insumo ${insumoId} no encontrado en el departamento ${departamentoAdquisicionId}`,
    //     );
    //   }
    //   if (insumoDepartamento.existencia < cantidad) {
    //     throw new NotFoundException(
    //       `Insumo ${insumoDepartamento.insumo.nombre} no tiene suficiente existencia`,
    //     );
    //   }
    //   return {
    //     insumoDepartamentoId: insumoDepartamento.id,
    //     cantidad: cantidad,
    //   };
    // });

    // const detalleAdquisicion: DetalleAdquisicionDto[] = await Promise.all(
    //   detalleAdquisicionPromise,
    // );

    const { nombre: nombreAdquisicion } =
      await this.departamentoService.findOne(departamentoAdquisicionId);
    const { nombre: nombreRetiro } =
      await this.departamentoService.findOne(departamentoRetiroId);

    const retiro = await this.create({
      usuarioId,
      detalles: detalleRetiros,
      descripcion:
        'Retiro de insumos del departamento ' +
        nombreRetiro +
        ' para el departamento ' +
        nombreAdquisicion,
    });
    const adquisicion = await this.adquisicionService.create({
      usuarioId,
      departamentoId: departamentoAdquisicionId,
      detalles: insumos,
      lotes: retiro.lotesR,
      descripcion:
        'Retiro de insumos del departamento ' +
        nombreRetiro +
        ' para el departamento ' +
        nombreAdquisicion,
    });
    return {
      descripcion:
        'Retiro de insumos del departamento ' +
        nombreRetiro +
        ' para el departamento ' +
        nombreAdquisicion,
      retiro: retiro,
      adquisicion: adquisicion,
    };
  }

  async crearMovimientoLote(
    insumoDepartamentoId: string,
    cantidad: number,
    detalleRetiroId: string,
  ) {
    const insumoDepartamento = await this.insumoDepartamentoService.findOne(insumoDepartamentoId);
    // Descontamos del lote
    const lotes = await this.lotesService.updateRetiroLote(
      insumoDepartamentoId,
      cantidad,
    );
    // se crea un movimiento lote.
    const lotesPromises = lotes.map(async (element) => {
      return await this.moviemintoLoteService.create({
        loteId: element.id,
        detalleRetiroId,
        cantidad: element.cantidadInical,
      });
    });

    await Promise.all(lotesPromises);

    return lotes;
  }
}
