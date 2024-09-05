import { Module } from '@nestjs/common';
import { MovimientoInsumosService } from './movimiento_insumos.service';
import { MovimientoInsumosController } from './movimiento_insumos.controller';

@Module({
  providers: [MovimientoInsumosService],
  controllers: [MovimientoInsumosController]
})
export class MovimientoInsumosModule {}
