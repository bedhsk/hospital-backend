import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MovimientoInsumo from './entities/movimiento_insumo.entity';
import { MovimientoInsumosController } from './movimiento_insumos.controller';
import { MovimientoInsumosService } from './movimiento_insumos.service';
import { InsumosModule } from 'src/insumos/insumos.module';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoInsumo]),
  InsumosModule,
  ],
  providers: [MovimientoInsumosService],
  controllers: [MovimientoInsumosController],
  exports: [MovimientoInsumosService],
})
export class MovimientoInsumosModule {}
