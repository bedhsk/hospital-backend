import { Module } from '@nestjs/common';
import { IndiceInsumosService } from './indice_insumos.service';
import { IndiceInsumosController } from './indice_insumos.controller';

@Module({
  providers: [IndiceInsumosService],
  controllers: [IndiceInsumosController]
})
export class IndiceInsumosModule {}
