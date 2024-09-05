import { Module } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Lote from './entities/lote.entity';
import { InsumosModule } from 'src/insumos/insumos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lote]),
  InsumosModule,
  ],
  providers: [LotesService],
  controllers: [LotesController],
  exports: [LotesService],
})
export class LotesModule {}
