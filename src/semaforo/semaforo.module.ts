import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import Insumo from 'src/insumos/entities/insumo.entity';
import movimientoLote from 'src/lotes/entities/movimiento-lote.entity';
import { SemaforoService } from './semaforo.service';
import { SemaforoController } from './semaforo.controller';
import DetalleRetiro from 'src/retiros/entities/detalleRetiro.entity';
import Retiro from 'src/retiros/entities/retiro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      movimientoLote,
      Insumo,
      InsumoDepartamento,
      Retiro,
      DetalleRetiro,
    ]),
  ],
  controllers: [SemaforoController],
  providers: [SemaforoService],
  exports: [SemaforoService],
})
export class SemaforoModule {}
