import { Module } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import Receta from './entities/receta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Receta])],
  controllers: [RecetasController],
  providers: [RecetasService],
})
export class RecetasModule {}
