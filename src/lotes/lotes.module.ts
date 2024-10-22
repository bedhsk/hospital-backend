import { Module } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Lote from './entities/lote.entity';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';
import Insumo from 'src/insumos/entities/insumo.entity';
import { InsumosService } from 'src/insumos/insumos.service';
import Departamento from 'src/departamentos/entities/departamento.entity';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import Categoria from 'src/categorias/entities/categoria.entity';
import { CategoriasService } from 'src/categorias/categorias.service';
import { MovimientolotesService } from './movimientolotes/movimientolotes.service';
import movimientoLote from './entities/movimiento-lote.entity';
import { DetalleretirosService } from 'src/retiros/detalleretiros/detalleretiros.service';
import { DetalleadquisicionesService } from 'src/adquisiciones/detalleadquisiciones/detalleadquisiciones.service';
import DetalleRetiro from 'src/retiros/entities/detalleRetiro.entity';
import detalleAdquisicion from 'src/adquisiciones/entities/detalle_adquisicion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lote,
      InsumoDepartamento,
      Insumo,
      Departamento,
      Categoria,
      movimientoLote,
      DetalleRetiro,
      detalleAdquisicion,
    ]),
  ],
  controllers: [LotesController],
  providers: [
    LotesService,
    InsumoDepartamentosService,
    InsumosService,
    DepartamentosService,
    CategoriasService,
    MovimientolotesService,
    DetalleretirosService,
    DetalleadquisicionesService,
  ],
  exports: [LotesService, MovimientolotesService],
})
export class LotesModule {}
