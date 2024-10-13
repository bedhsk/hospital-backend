import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsumoDepartamentosService } from '../../insumo_departamentos/insumo_departamentos.service';
import detalleAdquisicion from '../entities/detalle_adquisicion.entity';
import CreateDetalleAdquisicionDto from '../dtos/create-detalle_adquisicion.dto';
import UpdateDetalleAdquisicionDto from '../dtos/update-detalle_adquisicion.dto';

@Injectable()
export class DetalleadquisicionesService {  

  constructor(
    @InjectRepository(detalleAdquisicion)
    private readonly detalleAdquisicionesRepository: Repository<detalleAdquisicion>,
    private readonly insumoDepartamentosService: InsumoDepartamentosService,
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
  
  // Método para obtener un solo detalle de adquisicion por ID si está activo
  async findOne(id: string) {
    const detalleAdquisicion = await this.detalleAdquisicionesRepository.findOne({
      where: { id, is_active: true },
      relations: ['adquisicion', 'insumoDepartamento'],
    });
    if (!detalleAdquisicion) {
      throw new NotFoundException(
        `Insumo departamento con ID ${id} no encontrado o desactivado`,
      );
    }
    return detalleAdquisicion;
  }

  // Método para obtener un solo detalle de adquisicion por el ID de adquisicion si está activo
  async findAllByAdquisicionId(id: string) {
    const detalleAdquisicion = await this.detalleAdquisicionesRepository.find({
      where: {
        adquisicion: { id },
        is_active: true,
      },
      relations: ['adquisicion', 'insumoDepartamento'],
    });
  
    if (!detalleAdquisicion) {
      throw new NotFoundException(
        `Insumo departamento con ID de adquisición ${id} no encontrado o desactivado`,
      );
    }
    return detalleAdquisicion;
  }

  // Método para obtener un solo detalle de adquisicion por el ID de adquisicion si está activo
  async findOneByAdquisicionIdAndInsumoDepartamentoId(id: string, insumoDepartamentoId: string) {
    const detalleAdquisicion = await this.detalleAdquisicionesRepository.findOne({
      where: {
        adquisicion: { id },
        insumoDepartamento: { id: insumoDepartamentoId},
        is_active: true,
      },
    });
  
    if (!detalleAdquisicion) {
      throw new NotFoundException(
        `Insumo departamento con ID de adquisición ${id} no encontrado o desactivado`,
      );
    }
    
    return detalleAdquisicion;
  }

  // Crear un nuevo detalle adquisicion
  async create(createDetalleAdquisicion: CreateDetalleAdquisicionDto) {
    const { adquisicionId, insumoDepartamentoId, ...rest } = createDetalleAdquisicion;
    
    const insumoDepartamento = await this.insumoDepartamentosService.findOne(
      createDetalleAdquisicion.insumoDepartamentoId,
    );

    if (!insumoDepartamento) {
      throw new NotFoundException(
        `Insumo departamento con id ${insumoDepartamentoId} no encontrado`,
      );
    }

    // Actualizar la existencia del insumo departamento
    await this.insumoDepartamentosService.update(
      insumoDepartamento.id,
      {
        existencia: insumoDepartamento.existencia + createDetalleAdquisicion.cantidad 
      }
    );

    // Crear el nuevo detalle adquisicion con sus respectivas relaciones
    const detalleAdquisicion = this.detalleAdquisicionesRepository.create({
      ...rest,
      adquisicion: {id: adquisicionId},
      insumoDepartamento: {
        id: insumoDepartamento.id,
        existencia: insumoDepartamento.existencia,
      }, // Relacionar el detalleadquisicion con el insumoDepartamento encontrado
    });

    return await this.detalleAdquisicionesRepository.save(detalleAdquisicion);
  }

  // Actualizar un detalle adquisicion existente, si está activo
  async update(id: string, updateDetalleAdquisicionDto: UpdateDetalleAdquisicionDto) {
    const detalleAdquisicion = await this.findOne(id);
    if (!detalleAdquisicion) {
      throw new NotFoundException(
        `Detalle Adquisicion con ID ${id} no encontrado o desactivado`,
      );
    }
    
    const insumoDepartamento = await this.insumoDepartamentosService.findOne(
      detalleAdquisicion.insumoDepartamento.id,
    );
    
    if (!insumoDepartamento) {
      throw new NotFoundException(
        `Insumo departamento con id ${detalleAdquisicion.insumoDepartamento.id} no encontrado`,
      );
    }
    await this.insumoDepartamentosService.update(
      insumoDepartamento.id,
      {
        existencia: insumoDepartamento.existencia  + updateDetalleAdquisicionDto.cantidad - detalleAdquisicion.cantidad
      }
    );

    this.detalleAdquisicionesRepository.merge(detalleAdquisicion, {cantidad: updateDetalleAdquisicionDto.cantidad});
    return await this.detalleAdquisicionesRepository.save(detalleAdquisicion);
  }

  // Realiza el soft delete cambiando el campo is_active a false
  async softDelete(id: string) {
    const detalleAdquisicion = await this.findOne(id);
    if (!detalleAdquisicion) {
      throw new NotFoundException(
        `Detalle Adquisicion con ID ${id} no encontrado o ya desactivado`,
      );
    }

    if(detalleAdquisicion){
      const insumoDepartamento = await this.insumoDepartamentosService.findOne(detalleAdquisicion.insumoDepartamento.id)
      // Actualizar la existencia del insumo departamento
      await this.insumoDepartamentosService.update(
        insumoDepartamento.id,
        {
          existencia: insumoDepartamento.existencia - detalleAdquisicion.cantidad
        }
      );
    }
    // Cambiamos el campo is_active a false para realizar el soft delete
    detalleAdquisicion.is_active = false;
    return await this.detalleAdquisicionesRepository.save(detalleAdquisicion);
  }

}
