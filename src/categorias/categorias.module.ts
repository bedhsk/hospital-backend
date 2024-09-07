import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Categoria from './entities/categoria.entity';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],  // Importa el repositorio de Categoria
  providers: [CategoriasService],  // Proveedores (servicio)
  controllers: [CategoriasController],  // Controladores
  exports: [CategoriasService],  // Exporta el servicio para ser utilizado en otros módulos si es necesario
})
export class CategoriasModule {}
