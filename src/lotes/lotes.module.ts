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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lote,
      InsumoDepartamento,
      Insumo,
      Departamento,
      Categoria,
    ]),
  ],
  controllers: [LotesController],
  providers: [
    LotesService,
    InsumoDepartamentosService,
    InsumosService,
    DepartamentosService,
    CategoriasService,
  ],
  exports: [LotesService],
})
export class LotesModule {}
