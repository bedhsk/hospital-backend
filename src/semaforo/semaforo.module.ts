import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import Insumo from 'src/insumos/entities/insumo.entity';
import movimientoLote from 'src/lotes/entities/movimiento-lote.entity';
import { SemaforoService } from './semaforo.service';
import { SemaforoController } from './semaforo.controller';
import DetalleRetiro from 'src/retiros/entities/detalleRetiro.entity';
import Retiro from 'src/retiros/entities/retiro.entity';
import { DetalleretirosService } from 'src/retiros/detalleretiros/detalleretiros.service';
import { InsumosService } from 'src/insumos/insumos.service';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import Departamento from 'src/departamentos/entities/departamento.entity';
import Categoria from 'src/categorias/entities/categoria.entity';
import { CategoriasService } from 'src/categorias/categorias.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Categoria,
      movimientoLote,
      Insumo,
      Departamento,
      InsumoDepartamento,
      Retiro,
      DetalleRetiro,
    ]),
  ],
  controllers: [SemaforoController],
  providers: [
    CategoriasService,
    SemaforoService,
    DetalleretirosService,
    InsumoDepartamentosService,
    DepartamentosService,
    InsumosService,
  ],
  exports: [SemaforoService],
})
export class SemaforoModule {}
