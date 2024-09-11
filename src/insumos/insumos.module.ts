import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumosService } from './insumos.service';
import { InsumosController } from './insumos.controller';
import Insumo from './entities/insumo.entity';
import { CategoriasModule } from '../categorias/categorias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Insumo]),
    CategoriasModule,
  ],
  providers: [InsumosService],
  controllers: [InsumosController],
  exports: [InsumosService],
})
export class InsumosModule { }
