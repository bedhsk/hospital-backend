import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Insumo from './entities/insumo.entity';
import CreateInsumoDto from './dtos/create-insumo.dto';
import UpdateInsumoDto from './dtos/update-insumo.dto';
import QueryInsumoDto from './dtos/query-insumo.dto';
import Categoria from 'src/categorias/entities/categoria.entity';

@Injectable()
export class InsumosService {
  constructor(
    @InjectRepository(Insumo)
    private readonly insumoRepository: Repository<Insumo>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) { }

  // Método para obtener todos los insumos que están activos
  async findAll(query: QueryInsumoDto) {
    const { q, filter, page, limit } = query;
    const queryBuilder = this.insumoRepository.createQueryBuilder('insumo')
      .where({ is_active: true })
      .leftJoinAndSelect('insumo.categoria', 'categoria')
      .select([
        'insumo.id',
        'insumo.codigo',
        'insumo.nombre',
        'insumo.trazador',
        'insumo.categoriaId',
        'categoria.id',
        'categoria.nombre'
      ]);

    if (q) {
      queryBuilder.andWhere('insumo.nombre LIKE :nombre', { nombre: `%${q}%` });
    }

    if (filter) {
      queryBuilder.andWhere('categoria.nombre = :categoria', { categoria: `${filter}` });
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

  // Método para obtener un solo insumo por ID si está activo
  async findOne(id: string) {
    const insumo = await this.insumoRepository.findOne({ where: { id, is_active: true } });
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${id} no encontrado o desactivado`);
    }
    return insumo;
  }

  // Crear un nuevo insumo
  async create(createInsumoDto: CreateInsumoDto) {
    const { categoriaId, ...rest } = createInsumoDto;

    // Buscar la categoría a la que pertenece el insumo
    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });

    if (!categoria) {
      throw new NotFoundException(`Categoria con id ${categoriaId} no encontrada`);
    }

    // Crear el nuevo insumo con la categoría relacionada
    const insumo = this.insumoRepository.create({
      ...rest,
      categoria,  // Relacionar el insumo con la categoría encontrada
    });

    return await this.insumoRepository.save(insumo);
  }

  // Actualizar un insumo existente, si está activo
  async update(id: string, updateInsumoDto: UpdateInsumoDto) {
    const insumo = await this.findOne(id);
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${id} no encontrado o desactivado`);
    }
    this.insumoRepository.merge(insumo, updateInsumoDto);
    return await this.insumoRepository.save(insumo);
  }

  // Realiza el soft delete cambiando el campo is_active a false
  async softDelete(id: string) {
    const insumo = await this.findOne(id);
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${id} no encontrado o ya desactivado`);
    }
    // Cambiamos el campo is_active a false para realizar el soft delete
    insumo.is_active = false;
    return await this.insumoRepository.save(insumo);
  }
}