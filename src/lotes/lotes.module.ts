import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import Lote from './entities/lote.entity';
import { InsumosModule } from '../insumos/insumos.module';
import { InsumoDepartamentoModule } from 'src/insumo_departamentos/insumo_departamentos.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Lote]),
    InsumosModule,
    InsumoDepartamentoModule,
  ],
  providers: [LotesService],
  controllers: [LotesController],
  exports: [LotesService],
})
export class LotesModule { }
