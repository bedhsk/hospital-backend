import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MovimientoInsumo from './entities/movimiento_insumo.entity';
import { MovimientoInsumosController } from './movimiento_insumos.controller';
import { MovimientoInsumosService } from './movimiento_insumos.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoInsumo])],
  providers: [MovimientoInsumosService],
  controllers: [MovimientoInsumosController],
  exports: [MovimientoInsumosService],
})
export class MovimientoInsumosModule {}
