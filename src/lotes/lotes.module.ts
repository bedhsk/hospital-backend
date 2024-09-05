import { Module } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';

@Module({
  providers: [LotesService],
  controllers: [LotesController]
})
export class LotesModule {}
