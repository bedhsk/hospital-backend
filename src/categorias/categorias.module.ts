import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import Insumo from 'src/insumos/entities/insumo.entity';
import Categoria from './entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria, Insumo])], // Registramos la entidad Categoria
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
})
export class CategoriasModule {}
