import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Categoria from './entities/categoria.entity';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])], // Registramos la entidad Categoria
  providers: [CategoriasService],
  controllers: [CategoriasController],
  exports: [TypeOrmModule], // Exportamos el módulo para que otros módulos lo puedan usar
})
export class CategoriasModule {}