import { Injectable, NotFoundException } from '@nestjs/common';
import Adquisicion from './entities/adquisicion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateAdquisicionDto from './dtos/create-adquisicion.dto';
import { UsersService } from 'src/users/users.service';
import UpdateAdquisicionDto from './dtos/update-adquisicion.dto';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';
import { DetalleadquisicionesService } from './detalleadquisiciones/detalleadquisiciones.service';

@Injectable()
export class AdquisicionesService {
  constructor(
    @InjectRepository(Adquisicion)
    private readonly adquisicionRepository: Repository<Adquisicion>,
    private readonly detalleAdquisicionService: DetalleadquisicionesService,
    private readonly usuarioService: UsersService,
    private readonly insumoDepartamentoService: InsumoDepartamentosService,
  ) {}

  /*// Método para obtener todos los insumos que están activos
  async findAll(query: QueryInsumoDto) {
    const { q, filter, page, limit } = query;
    const queryBuilder = this.adquisicionRepository
      .createQueryBuilder('insumo')
      .where({ is_active: true })
      .leftJoinAndSelect('insumo.categoria', 'categoria')
      .select([
        'insumo.id',
        'insumo.codigo',
        'insumo.nombre',
        'insumo.trazador',
        'insumo.categoriaId',
        'categoria.id',
        'categoria.nombre',
      ]);

    if (q) {
      queryBuilder.andWhere('insumo.nombre LIKE :nombre', { nombre: `%${q}%` });
    }

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

    return {
      data: insumos,
      totalItems,
      totalPages,
      page,
    };
  }*/

  async findAll(){
    const adquisiciones = await this.adquisicionRepository.find({
      where: { is_active: true },
      relations: ['usuario'],
    })
    return adquisiciones
  }

  // Método para obtener un solo insumo por ID si está activo
  async findOne(id: string) {
    const adquisicion = await this.adquisicionRepository.findOne({
      where: { id, is_active: true },
      relations: ['usuario'],
    });
    if (!adquisicion) {
      throw new NotFoundException(
        `Insumo con ID ${id} no encontrado o desactivado`,
      );
    }
    return adquisicion;
  }

  // Crear un nuevo insumo
  async create(createAdquisicion: CreateAdquisicionDto) {
    const { usuarioId, insumoDepartamentoId, ...rest } = createAdquisicion;
    const usuario = await this.usuarioService.findOne(
      createAdquisicion.usuarioId,
    );

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con id ${usuarioId} no encontrado`,
      );
    }

    const insumoDepartamento = await this.insumoDepartamentoService.findOne(
      createAdquisicion.insumoDepartamentoId,
    );

    if (!insumoDepartamento) {
      throw new NotFoundException(
        `Insumo departamento con id ${insumoDepartamentoId} no encontrado`,
      );
    }

    // Crear la nueva adquisicion con el usuario relacionado
    const adquisicionCreate = this.adquisicionRepository.create({
      ...rest,
      usuario: {id: usuario.id, username: usuario.username}, // Relacionar el insumo con la categoría encontrada
    });
    
    const adquisicion = await this.adquisicionRepository.save(adquisicionCreate)
    // Crear el detalle con la cantidad y insumo departamento relacionado
    const detalleAdquisicion = await this.detalleAdquisicionService.create({
      adquisicionId: adquisicion.id,
      insumoDepartamentoId: insumoDepartamentoId,
      is_active: true,
      cantidad: createAdquisicion.cantidad,
    })

    return {adquisicion, detalleAdquisicion};
  }

  // Actualizar un insumo existente, si está activo
  async update(id: string, updateInsumoDto: UpdateAdquisicionDto) {
    const adquisicion = await this.findOne(id);
    if (!adquisicion) {
      throw new NotFoundException(
        `Adquisicion con ID ${id} no encontrado o desactivado`,
      );
    }
    this.adquisicionRepository.merge(adquisicion, updateInsumoDto);
    return await this.adquisicionRepository.save(adquisicion);
  }

  // Realiza el soft delete cambiando el campo is_active a false
  async softDelete(id: string) {
    const adquisicion = await this.findOne(id);
    if (!adquisicion) {
      throw new NotFoundException(
        `Adquisicion con ID ${id} no encontrado o ya desactivado`,
      );
    }
    // Cambiamos el campo is_active a false para realizar el soft delete
    adquisicion.is_active = false;
    return await this.adquisicionRepository.save(adquisicion);
  }
}
