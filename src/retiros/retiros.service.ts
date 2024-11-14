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
import { AdquisicionesService } from 'src/adquisiciones/adquisiciones.service';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import { LotesService } from 'src/lotes/lotes.service';
import { MovimientolotesService } from 'src/lotes/movimientolotes/movimientolotes.service';
import { createNewLoteDto } from 'src/lotes/dto/create-new-lote.dto';
import CreateRetiroExamenDto from './dto/create-retiro-examen.dto';
import { ExamenesService } from 'src/examenes/examenes.service';
import { InsumoExamenesService } from 'src/insumo_examenes/insumo_examenes.service';

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
    private readonly examenService: ExamenesService,
    private readonly insumosExamenService: InsumoExamenesService,
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
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo')
      .where('retiro.is_active = true')
      .select([
        'retiro', // Todos los campos de Retiro
        'user.id',
        'user.username', // Solo ID y username del usuario
        'detalleRetiro.id',
        'detalleRetiro.cantidad', // Solo ID y cantidad del detalle de reitro
        'insumoDepartamento.id',
        'insumoDepartamento.existencia', // Solo ID y existencia y nombre del insumoDepartamento
        'insumo.id',
        'insumo.nombre', // Solo ID y nombre del insumo
        'departamento.id',
        'departamento.nombre', // Id y nombre del departamento.
      ]);

    if (q) {
      queryBuilder.andWhere(
        '(user.username ILIKE :username OR departamento.nombre ILIKE :departamento)',
        {
          username: `%${q}%`,
          departamento: `%${q}%`,
        },
      );
    }

    if (filterDepartamento) {
      queryBuilder.andWhere('departamento.nombre = :departamento', {
        departamento: `${filterDepartamento}`,
      });
    }

    const totalItems = await queryBuilder.getCount();
    const retiros = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    const result = retiros.map((retiro) => ({
      id: retiro.id,
      createdAt: retiro.createdAt,
      descripcion: retiro.descripcion,
      user: {
        id: retiro.user.id,
        username: retiro.user.username,
      },
      detalleRetiro: retiro.detalleRetiro.map((detalle) => ({
        id: detalle.id,
        nombreInsumo: detalle.insumoDepartamento.insumo.nombre,
        cantidad: detalle.cantidad,
      })),
    }));

    return {
      data: result,
      totalItems,
      totalPages,
      page,
    };
  }

  async findAllInDepartamento(query: QueryRetiroDto) {
    const { q, filterDepartamento, page, limit, startDate, endDate } = query;
    const queryBuilder = this.retiroRepository
      .createQueryBuilder('retiro')
      .leftJoinAndSelect('retiro.user', 'user')
      .leftJoinAndSelect('retiro.detalleRetiro', 'detalleRetiro')
      .leftJoinAndSelect(
        'detalleRetiro.insumoDepartamento',
        'insumoDepartamento',
      )
      .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo')
      .where('retiro.is_active = true')
      .select([
        'retiro',
        'user.id',
        'user.username',
        'detalleRetiro.id',
        'detalleRetiro.cantidad',
        'insumoDepartamento.id',
        'insumoDepartamento.existencia',
        'insumo.id',
        'insumo.nombre',
        'departamento.id',
        'departamento.nombre',
      ]);

    // Si no se proporcionan fecha, filtrar por el día actual
    if (!startDate && !endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      queryBuilder.andWhere('retiro.createdAt >= :startDate', {
        startDate: today,
      });
      queryBuilder.andWhere('retiro.createdAt < :endDate', {
        endDate: tomorrow,
      });
    } else {
      // Si ses proporcionan fechas usar el rango especificado
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        queryBuilder.andWhere('retiro.createdAt >= :startDate', {
          startDate: start,
        });
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        queryBuilder.andWhere('retiro.createdAt <= :endDate', { endDate: end });
      }
    }

    if (q) {
      queryBuilder.andWhere(
        '(user.username ILIKE :username OR departamento.nombre ILIKE :departamento)',
        {
          username: `%${q}%`,
          departamento: `%${q}%`,
        },
      );
    }

    // Este filtro adicional por departamento
    if (filterDepartamento) {
      queryBuilder.andWhere('departamento.nombre = :departamento', {
        departamento: filterDepartamento,
      });
    }

    const totalItems = await queryBuilder.getCount();
    const retiros = await queryBuilder
      .orderBy('retiro.createdAt', 'DESC') // Agregamos ordenamiento por fecha
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    const result = retiros.map((retiro) => ({
      id: retiro.id,
      createdAt: retiro.createdAt,
      descripcion: retiro.descripcion,
      user: {
        id: retiro.user.id,
        username: retiro.user.username,
      },
      detalleRetiro: retiro.detalleRetiro.map((detalle) => ({
        id: detalle.id,
        nombreInsumo: detalle.insumoDepartamento.insumo.nombre,
        cantidad: detalle.cantidad,
      })),
    }));

    return {
      data: result,
      totalItems,
      totalPages,
      page,
      dateRange: {
        startDate: startDate || new Date(),
        endDate: endDate || new Date(),
      },
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
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo')
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
        'insumo.id',
        'insumo.nombre', // Id y nombre del insumo.
      ])
      .getOne();

    if (!retiro) {
      throw new NotFoundException(
        `Retiro con ID ${id} no encontrada o desactivada`,
      );
    }

    return retiro;
  }

  async findOneOut(id: string) {
    const retiro = await this.retiroRepository
      .createQueryBuilder('retiro')
      .leftJoinAndSelect('retiro.user', 'user')
      .leftJoinAndSelect('retiro.detalleRetiro', 'detalleRetiro')
      .leftJoinAndSelect(
        'detalleRetiro.insumoDepartamento',
        'insumoDepartamento',
      )
      .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo')
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
        'insumo.id',
        'insumo.nombre', // Solo ID y nombre del insumo
        'departamento.id',
        'departamento.nombre', // Id y nombre del departamento.
      ])
      .getOne();

    if (!retiro) {
      throw new NotFoundException(
        `Retiro con ID ${id} no encontrada o desactivada`,
      );
    }

    return {
      id: retiro.id,
      createdAt: retiro.createdAt,
      descripcion: retiro.descripcion,
      user: {
        id: retiro.user.id,
        username: retiro.user.username,
      },
      detalleRetiro: retiro.detalleRetiro.map((detalle) => ({
        id: detalle.id,
        nombreInsumo: detalle.insumoDepartamento.insumo.nombre,
        cantidad: detalle.cantidad,
      })),
    };
  }

  async create(createRetiro: CreateRetiroDto) {
    const lotesR: createNewLoteDto[] = [];
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

    const detallePromises = detalles.map(async (element) => {
      const { insumoDepartamentoId, cantidad } = element;
      const insumoDepartamento = await this.insumoDepartamentoService.findOne(insumoDepartamentoId);
      if (!insumoDepartamento) {
        throw new NotFoundException(
          `Insumo departamento con id ${insumoDepartamentoId} no encontrado`,
        );
      }
      if (insumoDepartamento.lotes.length === 0) {
        throw new NotFoundException(
          `Insumo departamento con id ${insumoDepartamentoId} no cuenta con lotes`,
        );
      }
      let cantidadAux = cantidad;
      if (insumoDepartamento.existencia < cantidad) {
        cantidadAux = insumoDepartamento.existencia;
      }
      const detalle = await this.detalleRetiroService.create({
        retiroId: retiro.id,
        insumoDepartamentoId,
        cantidad: cantidadAux,
      });
      // crear el movimiento lote
      const lote = await this.crearMovimientoLote(
        insumoDepartamentoId,
        detalle.cantidad,
        detalle.id,
      );
      lotesR.push(...lote);
      return { detalle, lotesR };
    });

    const lotes = await Promise.all(detallePromises);

    const detalleRetiro = await this.detalleRetiroService.findAllRetiroId(
      retiro.id,
    );

    return { retiro, detalleRetiro, lotesR };
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

    const detalleAdquisiciones: DetalleAdquisicionDto[] = await Promise.all(detalleRetiros.map(async (element) => {
      const { insumoDepartamentoId, cantidad } = element;
      const insumoDepartamento = await this.insumoDepartamentoService.findOne(insumoDepartamentoId);
      if (!insumoDepartamento) {
        throw new NotFoundException(
          `Insumo departamento con id ${insumoDepartamentoId} no encontrado`,
        );
      }
      return {
        insumoId: insumoDepartamento.insumo.id,
        cantidad,
      }
    }));

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
      detalles: detalleAdquisiciones,
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
    const insumoDepartamento =
      await this.insumoDepartamentoService.findOne(insumoDepartamentoId);
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

  async createByExams(retiroExamen: CreateRetiroExamenDto) {
    const { usuarioId, departamentoId, examenId, descripcion, ...rest } =
      retiroExamen;
    const usuario = await this.usuarioService.findOne(retiroExamen.usuarioId);
    const departamento = await this.departamentoService.findOne(
      retiroExamen.departamentoId,
    );
    const examen = await this.examenService.findOne(retiroExamen.examenId);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${usuarioId} no encontrado`);
    }
    if (!departamento) {
      throw new NotFoundException(
        `Departamento con id ${departamentoId} no encontrado`,
      );
    }
    if (!examen) {
      throw new NotFoundException(`Examen con id ${examenId} no encontrado`);
    }
    const insumosExamen = (
      await this.insumosExamenService.findAll({ examenId: examenId })
    ).data;

    const insumosDepartamentoPromise = insumosExamen.map(async (element) => {
      const { insumo, cantidad } = element;

      const insumoDeparamento =
        await this.insumoDepartamentoService.findByInsumoDepartamentoId(
          insumo.id,
          departamentoId,
        );

      if (!insumoDeparamento) {
        throw new NotFoundException(
          `Insumo ${insumo.nombre} no encontrado en el departamento`,
        );
      }

      const result: DetalleRetiroDto = {
        insumoDepartamentoId: insumoDeparamento.id,
        cantidad: cantidad,
      };

      return result;
    });

    const insumosDepartamento = await Promise.all(insumosDepartamentoPromise);

    const retiroPromise: CreateRetiroDto = {
      usuarioId: usuario.id,

      detalles: insumosDepartamento,
      ...rest,
    };

    const retiro = await this.create({
      usuarioId: usuario.id,
      descripcion: descripcion,
      detalles: insumosDepartamento,
      ...rest,
    });

    return retiro;
  }
}
