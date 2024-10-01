import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DetalleRetiro from '../entities/detalleRetiro.entity';
import { Repository } from 'typeorm';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';
import CreateDetalleRetiroDto from '../dto/create-detalle_retiro.dto';
import UpdateDetalleRetiroDto from '../dto/update-detalleretiro.dto';


@Injectable()
export class DetalleretirosService {


    constructor(
        @InjectRepository(DetalleRetiro)
        private readonly detalleRetiroRepository: Repository<DetalleRetiro>,
        private readonly insumoDepartamentosService: InsumoDepartamentosService,
      ) {}


      async findOne(id: string) {
        const detalleAdquisicion = await this.detalleRetiroRepository.findOne({
          where: { id, is_active: true },
          relations: ['retiro', 'insumoDepartamento'],
        });
        if (!detalleAdquisicion) {
          throw new NotFoundException(
            `Insumo con ID ${id} no encontrado o desactivado`,
          );
        }
        return detalleAdquisicion;
      }

      async create(createDetalleRetiro: CreateDetalleRetiroDto) {
        const { retiroId, insumoDepartamentoId, ...rest } = createDetalleRetiro;
        
        const insumoDepartamento = await this.insumoDepartamentosService.findOne(
            createDetalleRetiro.insumoDepartamentoId,
        );
    
        if (!insumoDepartamento) {
          throw new NotFoundException(
            `Insumo departamento con id ${insumoDepartamentoId} no encontrado`,
          );
        }
    
        // Crear el nuevo detalle retiro con sus respectivas relaciones
        const detalleAdquisicion = this.detalleRetiroRepository.create({
          ...rest,
          insumoDepartamento, // Relacionar el detalleadquisicion con el insumoDepartamento encontrado
        });
    
        return await this.detalleRetiroRepository.save(detalleAdquisicion);
      }

 
        // Actualizar un detalle retiro existente
  async update(id: string, updateDetalleRetiroDto: UpdateDetalleRetiroDto) {
    const detalleAdquisicion = await this.findOne(id);
    if (!detalleAdquisicion) {
      throw new NotFoundException(
        `Detalle reitro con ID ${id} no encontrado o desactivado`,
      );
    }
    
    const insumoDepartamento = await this.insumoDepartamentosService.findOne(
        updateDetalleRetiroDto.insumoDepartamentoId,
    );
    
    if (!insumoDepartamento) {
      throw new NotFoundException(
        `Insumo departamento con id ${updateDetalleRetiroDto.insumoDepartamentoId} no encontrado`,
      );
    }

    this.detalleRetiroRepository.merge(detalleAdquisicion, updateDetalleRetiroDto);
    return await this.detalleRetiroRepository.save(detalleAdquisicion);
  }

  // Realiza el soft delete cambiando el campo is_active a false
  async softDelete(id: string) {
    const detalleRetiro = await this.findOne(id);
    if (!detalleRetiro) {
      throw new NotFoundException(
        `Detalle Adquisicion con ID ${id} no encontrado o ya desactivado`,
      );
    }
    // Cambiamos el campo is_active a false para realizar el soft delete
    detalleRetiro.is_active = false;
    return await this.detalleRetiroRepository.save(detalleRetiro);
  }
}
