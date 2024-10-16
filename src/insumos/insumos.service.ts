import {
  ConflictException,
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
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';

@Injectable()
export class InsumosService {
  constructor(
    @InjectRepository(Insumo)
    private readonly insumoRepository: Repository<Insumo>,
    private readonly categoriaService: CategoriasService,
  ) {}

  // Método para obtener todos los insumos que están activos
  async findAll(query: QueryInsumoDto) {
    const { q, filter, page, limit } = query;

    const queryBuilder = this.insumoRepository
        .createQueryBuilder('insumo')
        .where({ is_active: true })
        .leftJoinAndSelect('insumo.categoria', 'categoria')
        .leftJoinAndSelect('insumo.insumosDepartamentos', 'insumoDepartamento')
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
            'lote.id',
            'lote.numeroLote',
            'lote.fechaEntrada',
            'lote.fechaCaducidad',
            'lote.cantidadInical',
            'lote.cantidadActual',
            'lote.status',
        ]);

    // Filtro por nombre del insumo
    if (q) {
        queryBuilder.andWhere('insumo.nombre LIKE :nombre', { nombre: `%${q}%` });
    }

    // Filtro por categoría
    if (filter) {
        queryBuilder.andWhere('categoria.nombre = :categoria', {
            categoria: `${filter}`,
        });
    }

    const totalItems = await queryBuilder.getCount();
    const insumos = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    const result = insumos.map((insumo) => ({
        id: insumo.id,
        codigo: insumo.codigo,
        nombre: insumo.nombre,
        trazador: insumo.trazador,
        categoria: {
            id: insumo.categoria.id,
            nombre: insumo.categoria.nombre,
        },
        lotes: (insumo.insumosDepartamentos || []).flatMap((dep) =>
            dep.lotes ? dep.lotes.map((lote) => ({
                id: lote.id,
                numeroLote: lote.numeroLote,
                fechaEntrada: lote.fechaEntrada,
                fechaCaducidad: lote.fechaCaducidad,
                cantidadInical: lote.cantidadInical,
                cantidadActual: lote.cantidadActual,
                status: lote.status,
            })) : []
        ),
    }));

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

  // Crear un nuevo insumo
  async create(createInsumoDto: CreateInsumoDto) {
    const { categoriaId, codigo, ...rest } = createInsumoDto;

    // Verificar si el código del insumo ya existe
    const existingInsumo = await this.insumoRepository.findOne({
      where: { codigo },
    });

    if (existingInsumo) {
      throw new ConflictException('El código ingresado está en uso');
    }

    const categoria = await this.categoriaService.findOne(
      createInsumoDto.categoriaId,
    );

    if (!categoria) {
      throw new NotFoundException(
        `Categoria con id ${categoriaId} no encontrada`,
      );
    }

    // Crear el nuevo insumo con la categoría relacionada
    try {
      const insumo = this.insumoRepository.create({
        ...rest,
        codigo, // Asignar el código del insumo
        categoria, // Relacionar el insumo con la categoría encontrada
      });

      return await this.insumoRepository.save(insumo);
    } catch (error) {
      // Captura detallada de cualquier error que ocurra
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
