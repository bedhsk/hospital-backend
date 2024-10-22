import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import movimientoLote from '../entities/movimiento-lote.entity';
import { Repository } from 'typeorm';
import { DetalleadquisicionesService } from 'src/adquisiciones/detalleadquisiciones/detalleadquisiciones.service';
import { DetalleretirosService } from 'src/retiros/detalleretiros/detalleretiros.service';
import { LotesService } from '../lotes.service';
import CreateMovimientoLoteDto from '../dto/create-movimiento-lote.dto';

@Injectable()
export class MovimientolotesService {
  constructor(
    @InjectRepository(movimientoLote)
    private readonly movimientoLoteRepository: Repository<movimientoLote>,
    private readonly detalleAdquisicionService: DetalleadquisicionesService,
    private readonly detalleRetiroService: DetalleretirosService,
    private readonly loteService: LotesService
  ) {}

  // Crear un nuevo movimiento lote
  async create(createMovimientoLote: CreateMovimientoLoteDto) {
    const { loteId, detalleAdquisicionId, detalleRetiroId, ...rest } = createMovimientoLote;
    
    const lote = await this.loteService.findOne(loteId);
    if (!lote) {
      throw new NotFoundException(`Lote con id ${loteId} no encontrado`);
    }
  
    let detalleAdquisicion = null;
    if (detalleAdquisicionId) {
      detalleAdquisicion = await this.detalleAdquisicionService.findOne(detalleAdquisicionId);
      if (!detalleAdquisicion) {
        throw new NotFoundException(`Detalle adquisicion con id ${detalleAdquisicionId} no encontrado`);
      }
    }
  
    let detalleRetiro = null;
    if (detalleRetiroId) {
      detalleRetiro = await this.detalleRetiroService.findOne(detalleRetiroId);
      if (!detalleRetiro) {
        throw new NotFoundException(`Detalle retiro con id ${detalleRetiroId} no encontrado`);
      }
    }

    const movimientoLote = this.movimientoLoteRepository.create({
      ...rest,
      lote: { id: loteId },
      detalleAdquisicion: detalleAdquisicion ? { id: detalleAdquisicionId } : null,
      detalleRetiro: detalleRetiro ? { id: detalleRetiroId } : null,
    });
  
    return await this.movimientoLoteRepository.save(movimientoLote);
  }


}
