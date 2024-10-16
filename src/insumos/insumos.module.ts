import { Module } from '@nestjs/common';
import { InsumosService } from './insumos.service';
import { InsumosController } from './insumos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Insumo from './entities/insumo.entity';
import Categoria from 'src/categorias/entities/categoria.entity';
import { CategoriasService } from 'src/categorias/categorias.service';
import InsumoExamen from 'src/insumo_examenes/entities/insumo_examen.entity';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import Lote from 'src/lotes/entities/lote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Insumo, Categoria, InsumoExamen, InsumoDepartamento, Lote])],
  controllers: [InsumosController],
  providers: [InsumosService, CategoriasService],
  exports: [InsumosService],
})
export class InsumosModule {}
