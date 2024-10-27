import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInsumoDepartamentoDto } from './dto/create-insumo_departamento.dto';
import UpdateInsumoDepartamentoDto from './dto/update-insumo_departamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InsumosService } from 'src/insumos/insumos.service';
import { Repository } from 'typeorm';
import QueryIsumoDepartamentoDto from './dto/query-insumo_departamento.dto';
import { InsumoDepartamento } from './entities/insumo_departamento.entity';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import { log } from 'console';

@Injectable()
export class InsumoDepartamentosService {
  constructor(
    @InjectRepository(InsumoDepartamento)
    private readonly insumodepartamentoService: Repository<InsumoDepartamento>,
    private readonly departamentoService: DepartamentosService,
    @Inject(forwardRef(() => InsumosService))
    private readonly insumoService: InsumosService,
  ) {}

  async findAll(query: QueryIsumoDepartamentoDto) {
    const { q, filter, page, limit } = query;
    const queryBuilder = this.insumodepartamentoService
      .createQueryBuilder('insumoDepartamento')
      .where({ is_active: true })
      .leftJoinAndSelect('insumoDepartamento.insumo', 'insumo')
      .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
      .select([
        'insumoDepartamento.id',
        'insumoDepartamento.existencia',
        'insumoDepartamento.insumoId',
        'insumoDepartamento.departamentoId',
        'insumo.id',
        'insumo.nombre',
        'departamento.id',
        'departamento.nombre',
      ]);

    if (q) {
      queryBuilder.andWhere('insumo.nombre LIKE :nombre', { nombre: `%${q}%` });
    }

    if (filter) {
      queryBuilder.andWhere('departamento.nombre = :departamento', {
        departamento: `${filter}`,
      });
    }

    const totalItems = await queryBuilder.getCount();
    const insumoDepartamentos = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: insumoDepartamentos,
      totalItems,
      totalPages,
      page,
    };
  }

  async findOne(id: string) {
    const insumoDepartamento = await this.insumodepartamentoService.findOne({
      where: { id, is_active: true },
      relations: ['insumo', 'departamento'],
    });
    if (!insumoDepartamento) {
      throw new NotFoundException(
        `InsumoDepartamento con ID ${id} no encontrado o desactivado`,
      );
    }
    return insumoDepartamento;
  }

  async findOneByInsumoAndDepartamento(
    insumoId: string,
    departamentoId: string,
    isDestino: boolean = false,
  ) {
    const insumoDepartamento = await this.insumodepartamentoService.findOne({
      where: {
        insumo: { id: insumoId },
        departamento: { id: departamentoId },
        is_active: true,
      },
      relations: ['insumo', 'departamento'],
    });

    if (!insumoDepartamento) {
      const insumo = await this.insumoService.findOne(insumoId);
      const departamento =
        await this.departamentoService.findOne(departamentoId);

      if (!insumo) {
        throw new NotFoundException(`Insumo con ID ${insumoId} no encontrado`);
      }
      if (!departamento) {
        throw new NotFoundException(
          `Departamento con ID ${departamentoId} no encontrado`,
        );
      }

      if (isDestino) {
        // Si es el departamento destino, creamos automáticamente el InsumoDepartamento
        const newInsumoDepartamento = this.insumodepartamentoService.create({
          insumo,
          departamento,
          existencia: 0,
        });
        return await this.insumodepartamentoService.save(newInsumoDepartamento);
      } else {
        // Si es el departamento origen, lanzamos un error
        throw new NotFoundException(
          `No se encontró una relación activa entre el insumo "${insumo.nombre}" y el departamento "${departamento.nombre}"`,
        );
      }
    }

    return insumoDepartamento;
  }

  async create(createInsumoDepartamentoDto: CreateInsumoDepartamentoDto) {
    const { insumoId, departamentoId, ...rest } = createInsumoDepartamentoDto;
    const insumo = await this.insumoService.findOne(
      createInsumoDepartamentoDto.insumoId,
    );
    const departamento = await this.departamentoService.findOne(
      createInsumoDepartamentoDto.departamentoId,
    );

    if (!insumo) {
      throw new NotFoundException(`Insumo con id ${insumoId} no encontrado`);
    }

    if (!departamento) {
      throw new NotFoundException(
        `Departamento con id ${departamentoId} no encontrado`,
      );
    }

    // Crear la relación entre insumo y departamento
    const insumoDepartamento = this.insumodepartamentoService.create({
      ...rest,
      insumo,
      departamento,
    });

    return this.insumodepartamentoService.save(insumoDepartamento);
  }

  async update(
    id: string,
    updateInsumoDepartamentoDto: UpdateInsumoDepartamentoDto,
  ) {
    const insumoDepartamento = await this.findOne(id);
    if (!insumoDepartamento) {
      throw new NotFoundException(
        `InsumoDepartamento con ID ${id} no encontrado o desactivado`,
      );
    }
    this.insumodepartamentoService.merge(
      insumoDepartamento,
      updateInsumoDepartamentoDto,
    );
    return await this.insumodepartamentoService.save(insumoDepartamento);
  }

  async softDelete(id: string) {
    const insumoDepartamento = await this.findOne(id);
    if (!insumoDepartamento) {
      throw new NotFoundException(
        `InsumoDepartamento con ID ${id} no encontrado o ya desactivado`,
      );
    }
    // Soft delete: cambia el campo `is_active` a false
    insumoDepartamento.is_active = false;
    return await this.insumodepartamentoService.save(insumoDepartamento);
  }

  async findByInsumoDepartamentoId(insumoId: string, departamentoId: string) {
    const departamento = await this.departamentoService.findOne(departamentoId);
    if (!departamento) {
      throw new NotFoundException(
        `Departamento con ID ${departamentoId} no encontrado`,
      );
    }
    const insumo = await this.insumoService.findOne(insumoId);
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${insumoId} no encontrado`);
    }
    const insumoDepartamento = await this.insumodepartamentoService.findOne({
      where: {
        insumo: {
          id: insumo.id,
          nombre: insumo.nombre,
          trazador: insumo.trazador,
        },
        departamento: { id: departamento.id, nombre: departamento.nombre },
        is_active: true,
      },
      relations: ['insumo', 'departamento'],
    });
    if (!insumoDepartamento) {
      throw new NotFoundException(
        `InsumoDepartamento con insumo ID ${insumoId} y departamento ID ${departamentoId} no encontrado`,
      );
    }
    return insumoDepartamento;
  }
}
