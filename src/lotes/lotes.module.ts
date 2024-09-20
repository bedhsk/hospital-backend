import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import Lote from './entities/lote.entity';
import { InsumosModule } from '../insumos/insumos.module';
import { InsumoDepartamentoModule } from 'src/insumo_departamentos/insumo_departamentos.module';
import Insumo from '../insumos/entities/insumo.entity';
import InsumoDepartamento from '../insumo_departamentos/entities/insumo_departamento.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Lote, Insumo, InsumoDepartamento]),  // Importamos las entidades necesarias
  ],
  providers: [LotesService],
  controllers: [LotesController],
})
export class LotesModule {}
