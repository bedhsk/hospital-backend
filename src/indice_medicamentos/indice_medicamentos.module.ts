import { Module } from '@nestjs/common';
import { IndiceMedicamentosService } from './indice_medicamentos.service';
import { IndiceMedicamentosController } from './indice_medicamentos.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import IndiceMedicamento from './entities/indice_medicamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndiceMedicamento])],
  providers: [IndiceMedicamentosService],
  controllers: [IndiceMedicamentosController],
  exports: [IndiceMedicamentosService],
})
export class IndiceMedicamentosModule {}
