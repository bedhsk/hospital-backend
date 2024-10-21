import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import UpdateInsumoDto from './dto/update-insumo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriasService } from 'src/categorias/categorias.service';
import { Repository } from 'typeorm';
import QueryInsumoDto from './dto/query-insumo.dto';
import Insumo from './entities/insumo.entity';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';

@Injectable()
export class InsumosService {
  constructor(
    @InjectRepository(Insumo)
    private readonly insumoRepository: Repository<Insumo>,
    private readonly categoriaService: CategoriasService,
    private readonly departamentosService: DepartamentosService,
    @Inject(forwardRef(() => InsumoDepartamentosService))
    private readonly insumoDepartamentosService: InsumoDepartamentosService,
  ) {}

  // Método para obtener todos los insumos que están activos con el total de cantidad actual
  async findAll(query: QueryInsumoDto) {
    const { q, filter, page = 1, limit = 10 } = query;

    const insumosConTotalCantidad =
      await this.getInsumosWithTotalCantidadActual();

    const queryBuilder = this.insumoRepository
      .createQueryBuilder('insumo')
      .where({ is_active: true })
      .leftJoinAndSelect('insumo.categoria', 'categoria')
      .leftJoinAndSelect('insumo.insumosDepartamentos', 'insumoDepartamento')
      .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
      .leftJoinAndSelect('insumoDepartamento.lotes', 'lote')
      .select([
        'insumo.id',
        'insumo.codigo',
        'insumo.nombre',
        'insumo.trazador',
        'insumo.categoriaId',
        'categoria.id',
        'categoria.nombre',
        'insumoDepartamento.id',
        'insumoDepartamento.existencia',
        'departamento.id',
        'departamento.nombre',
        'lote.id',
        'lote.numeroLote',
        'lote.fechaEntrada',
        'lote.fechaCaducidad',
        'lote.cantidadInical',
        'lote.cantidadActual',
        'lote.status',
      ]);

    if (q) {
      queryBuilder.andWhere('insumo.nombre LIKE :nombre', { nombre: `%${q}%` });
    }

    if (filter) {
      queryBuilder.andWhere('categoria.nombre = :categoria', {
        categoria: filter,
      });
    }

    const totalItems = await queryBuilder.getCount();
    const insumos = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    const result = insumos.map((insumo) => {
      const totalCantidad =
        insumosConTotalCantidad.find((i) => i.insumoId === insumo.id)
          ?.totalCantidadActual || 0;

      const departamentos = insumo.insumosDepartamentos.map((insumoDep) => ({
        id: insumoDep.departamento.id,
        nombre: insumoDep.departamento.nombre,
        existencia: insumoDep.existencia,
      }));

      return {
        id: insumo.id,
        codigo: insumo.codigo,
        nombre: insumo.nombre,
        trazador: insumo.trazador,
        categoria: {
          id: insumo.categoria.id,
          nombre: insumo.categoria.nombre,
        },
        totalCantidadActual: totalCantidad,
        departamentos,
        lotes: insumo.insumosDepartamentos.flatMap((dep) =>
          dep.lotes
            ? dep.lotes
                .filter((lote) => lote.cantidadActual > 0)
                .map((lote) => ({
                  id: lote.id,
                  numeroLote: lote.numeroLote,
                  fechaEntrada: lote.created_at,
                  fechaCaducidad: lote.fechaCaducidad,
                  cantidadInical: lote.cantidadInical,
                  cantidadActual: lote.cantidadActual,
                  status: lote.status,
                }))
            : [],
        ),
      };
    });

    return {
      data: result,
      totalItems,
      totalPages,
      page,
    };
  }

  // Método para obtener un solo insumo por ID si está activo
  async findOne(id: string) {
    const insumo = await this.insumoRepository.findOne({
      where: { id, is_active: true },
      relations: ['categoria'],
    });
    if (!insumo) {
      throw new NotFoundException(
        `Insumo con ID ${id} no encontrado o desactivado`,
      );
    }
    return insumo;
  }

  async findOneWithDepartamentosAndLotes(id: string) {
    const insumo = await this.insumoRepository.findOne({
      where: { id, is_active: true },
      relations: [
        'categoria',
        'insumosDepartamentos',
        'insumosDepartamentos.departamento',
        'insumosDepartamentos.lotes',
      ],
    });

    if (!insumo) {
      throw new NotFoundException(
        `Insumo con ID ${id} no encontrado o desactivado`,
      );
    }

    const departamentos = insumo.insumosDepartamentos.map((insumoDep) => ({
      id: insumoDep.departamento.id,
      nombre: insumoDep.departamento.nombre,
      existencia: insumoDep.existencia,
    }));

    const lotes = insumo.insumosDepartamentos.flatMap((insumoDep) =>
      insumoDep.lotes
        .filter((lote) => lote.cantidadActual > 0)
        .map((lote) => ({
          id: lote.id,
          numeroLote: lote.numeroLote,
          fechaEntrada: lote.created_at,
          fechaCaducidad: lote.fechaCaducidad,
          cantidadInical: lote.cantidadInical,
          cantidadActual: lote.cantidadActual,
          status: lote.status,
        })),
    );

    return {
      id: insumo.id,
      codigo: insumo.codigo,
      nombre: insumo.nombre,
      trazador: insumo.trazador,
      categoria: {
        id: insumo.categoria.id,
        nombre: insumo.categoria.nombre,
      },
      departamentos,
      lotes,
    };
  }

  async create(createInsumoDto: CreateInsumoDto) {
    const { categoriaId, codigo, departamentos, ...rest } = createInsumoDto;

    // Verificar si el código del insumo ya existe
    const existingInsumo = await this.insumoRepository.findOne({
      where: { codigo },
      withDeleted: true,
    });

    if (existingInsumo) {
      throw new ConflictException('El código ingresado está en uso');
    }

    const categoria = await this.categoriaService.findOne(categoriaId);

    if (!categoria) {
      throw new NotFoundException(
        `Categoria con id ${categoriaId} no encontrada`,
      );
    }

    try {
      // Crear el nuevo insumo
      const insumo = this.insumoRepository.create({
        ...rest,
        codigo,
        categoria,
      });

      const savedInsumo = await this.insumoRepository.save(insumo);

      // Crear las asociaciones InsumoDepartamento
      for (const dep of departamentos) {
        const departamento = await this.departamentosService.findOne(
          dep.departamentoId,
        );
        if (!departamento) {
          throw new NotFoundException(
            `Departamento con id ${dep.departamentoId} no encontrado`,
          );
        }

        await this.insumoDepartamentosService.create({
          insumoId: savedInsumo.id,
          departamentoId: dep.departamentoId,
          existencia: dep.existencia,
        });
      }

      // Obtener el insumo con sus relaciones actualizadas
      return this.findOneWithDepartamentosAndLotes(savedInsumo.id);
    } catch (error) {
      console.error('Error al crear el insumo:', error);
      throw new InternalServerErrorException(
        'Error al crear el insumo',
        error.message,
      );
    }
  }

  // Actualizar un insumo existente, si está activo
  async update(id: string, updateInsumoDto: UpdateInsumoDto) {
    const insumo = await this.findOne(id);
    if (!insumo) {
      throw new NotFoundException(
        `Insumo con ID ${id} no encontrado o desactivado`,
      );
    }

    // Verificar si el código del insumo ya existe
    const existingInsumo = await this.insumoRepository.findOne({
      where: { codigo: updateInsumoDto.codigo },
      withDeleted: true,
    });

    if (existingInsumo) {
      throw new ConflictException(
        `El código de insumo ${updateInsumoDto.codigo} ya está en uso.`,
      );
    }

    this.insumoRepository.merge(insumo, updateInsumoDto);
    return await this.insumoRepository.save(insumo);
  }

  // Realiza el soft delete cambiando el campo is_active a false
  async softDelete(id: string) {
    const insumo = await this.findOne(id);
    if (!insumo) {
      throw new NotFoundException(
        `Insumo con ID ${id} no encontrado o ya desactivado`,
      );
    }
    // Cambiamos el campo is_active a false para realizar el soft delete
    insumo.is_active = false;
    return await this.insumoRepository.save(insumo);
  }

  async getInsumosWithTotalCantidadActual(): Promise<any> {
    const query = `
      SELECT 
        "insumoDepartamento"."insumoId",
        "insumo"."nombre",
        SUM("lote"."cantidadActual") AS "totalCantidadActual"
      FROM 
        "lote"
      JOIN 
        "insumoDepartamento" 
        ON "lote"."insumoDepartamentoId" = "insumoDepartamento"."id"
      JOIN 
        "insumo"
        ON "insumoDepartamento"."insumoId" = "insumo"."id"
      GROUP BY 
        "insumoDepartamento"."insumoId",
        "insumo"."nombre";
    `;
    return await this.insumoRepository.query(query);
  }
}
