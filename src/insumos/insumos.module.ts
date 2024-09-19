import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Insumo from './entities/insumo.entity';
import { InsumosService } from './insumos.service';
import { InsumosController } from './insumos.controller';
//import Categoria from 'src/categorias/entities/categoria.entity';
import Categoria from '../categorias/entities/categoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Insumo, Categoria]),  // Importamos la entidad Categoria
  ],
  providers: [InsumosService],
  controllers: [InsumosController],
})
export class InsumosModule {}
