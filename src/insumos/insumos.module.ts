import { Module } from '@nestjs/common';
import { InsumosService } from './insumos.service';
import { InsumosController } from './insumos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Insumo from './entities/insumo.entity';
import Categoria from 'src/categorias/entities/categoria.entity';
import { CategoriasService } from 'src/categorias/categorias.service';

@Module({
  imports: [TypeOrmModule.forFeature([Insumo, Categoria])],
  controllers: [InsumosController],
  providers: [InsumosService, CategoriasService],
  exports: [InsumosService],
})
export class InsumosModule {}
