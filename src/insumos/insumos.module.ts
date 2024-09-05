import { Module } from '@nestjs/common';
import { InsumosService } from './insumos.service';
import { InsumosController } from './insumos.controller';

@Module({
  providers: [InsumosService],
  controllers: [InsumosController]
})
export class InsumosModule {}
