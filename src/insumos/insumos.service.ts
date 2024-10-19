import { Injectable, NotFoundException } from '@nestjs/common';
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

// Método para obtener todos los insumos que están activos con el total de cantidad actual
async findAll(query: QueryInsumoDto) {
  const { q, filter, page, limit } = query;

  // Ejecutamos primero la consulta que obtiene el total de la cantidad actual por insumo
  const insumosConTotalCantidad = await this.getInsumosWithTotalCantidadActual();

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

  // Mapeamos los insumos y agregamos el total de cantidad actual usando los resultados de la otra consulta
  const result = insumos.map((insumo) => {
    // Buscamos el total de cantidad actual para el insumo actual
    const totalCantidad = insumosConTotalCantidad.find(
      (i) => i.insumoId === insumo.id
    )?.totalCantidadActual || 0; // Si no se encuentra, se asigna 0

    return {
      id: insumo.id,
      codigo: insumo.codigo,
      nombre: insumo.nombre,
      trazador: insumo.trazador,
      categoria: {
        id: insumo.categoria.id,
        nombre: insumo.categoria.nombre,
      },
      totalCantidadActual: totalCantidad, // Agregamos el total de cantidad actual
      // Filtramos los lotes para excluir aquellos cuya cantidadActual sea 0
      lotes: (insumo.insumosDepartamentos || []).flatMap((dep) =>
        dep.lotes
          ? dep.lotes
              .filter((lote) => lote.cantidadActual > 0) // Excluir lotes con cantidadActual = 0
              .map((lote) => ({
                id: lote.id,
                numeroLote: lote.numeroLote,
                fechaEntrada: lote.fechaEntrada,
                fechaCaducidad: lote.fechaCaducidad,
                cantidadInical: lote.cantidadInical,
                cantidadActual: lote.cantidadActual,
                status: lote.status,
              }))
          : []
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

  // Crear un nuevo insumo
  async create(createInsumoDto: CreateInsumoDto) {
    const { categoriaId, ...rest } = createInsumoDto;
    const categoria = await this.categoriaService.findOne(
      createInsumoDto.categoriaId,
    );

    if (!categoria) {
      throw new NotFoundException(
        `Categoria con id ${categoriaId} no encontrada`,
      );
    }

    // Crear el nuevo insumo con la categoría relacionada
    const insumo = this.insumoRepository.create({
      ...rest,
      categoria, // Relacionar el insumo con la categoría encontrada
    });

    return await this.insumoRepository.save(insumo);
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
