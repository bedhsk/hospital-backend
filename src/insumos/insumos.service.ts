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
import { Not, Repository } from 'typeorm';
import QueryInsumoDto from './dto/query-insumo.dto';
import Insumo from './entities/insumo.entity';

@Injectable()
export class InsumosService {
  constructor(
    @InjectRepository(Insumo)
    private readonly insumoRepository: Repository<Insumo>,
    private readonly categoriaService: CategoriasService,
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
        'lote.created_at',
        'lote.fechaCaducidad',
        'lote.cantidadInical',
        'lote.cantidadActual',
        'lote.status',
      ]);

    if (q) {
      queryBuilder.andWhere(
        'unaccent(insumo.nombre) ILIKE unaccent(:nombre) OR unaccent(insumo.codigo) ILIKE unaccent(:codigo)',
        { nombre: `%${q}%`, codigo: `%${q}%` },
      );
    }

    if (filter) {
      queryBuilder.andWhere(
        'unaccent(categoria.nombre) = unaccent(:categoria)',
        {
          categoria: filter,
        },
      );
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
        totalCantidadActual: +totalCantidad,
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
    const { categoriaId, codigo, ...rest } = createInsumoDto;

    // Verificar si el código del insumo ya existe
    const existingInsumo = await this.insumoRepository.findOne({
      where: { codigo },
      withDeleted: true,
    });

    if (existingInsumo) {
      // Si existe un insumo con el mismo código, reactivarlo
      if (!existingInsumo.is_active) {
        // Actualizar los datos del insumo reactivado con los nuevos datos
        this.insumoRepository.merge(existingInsumo, {
          ...rest,
          categoria: await this.categoriaService.findOne(categoriaId), // Actualiza la categoría
        });

        existingInsumo.is_active = true; // Reactivar el insumo
        await this.insumoRepository.save(existingInsumo); // Guardar los cambios
        return existingInsumo; // Devolver el insumo reactivado
      } else {
        throw new ConflictException('El código ingresado está en uso'); // Solo si ya está activo
      }
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
      return {
        id: savedInsumo.id,
        codigo: savedInsumo.codigo,
        nombre: savedInsumo.nombre,
        trazador: savedInsumo.trazador,
        categoria: {
          id: savedInsumo.categoria.id,
          nombre: savedInsumo.categoria.nombre,
        },
      };
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

    // Solo verificamos si se está intentando cambiar el código
    if (updateInsumoDto.codigo && updateInsumoDto.codigo !== insumo.codigo) {
      // Verificar si el código del insumo ya existe en otro registro
      const existingInsumo = await this.insumoRepository.findOne({
        where: { codigo: updateInsumoDto.codigo, id: Not(id) },
        withDeleted: true,
      });

      if (existingInsumo) {
        throw new ConflictException(
          `El código de insumo ${updateInsumoDto.codigo} ya está en uso.`,
        );
      }
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

  async findActive(query: QueryInsumoDto): Promise<{
    data: Insumo[];
    totalItems: number;
    totalPages: number;
    page: number;
  }> {
    const { q, filter, page = 1, limit = 10 } = query;

    const queryBuilder = this.insumoRepository
      .createQueryBuilder('insumo')
      .where({ is_active: true });

    if (q) {
      queryBuilder.andWhere(
        'unaccent(insumo.nombre) ILIKE unaccent(:nombre) OR unaccent(insumo.codigo) ILIKE unaccent(:codigo)',
        { nombre: `%${q}%`, codigo: `%${q}%` },
      );
    }

    if (filter) {
      queryBuilder.andWhere(
        'unaccent(categoria.nombre) = unaccent(:categoria)',
        {
          categoria: filter,
        },
      );
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
}
