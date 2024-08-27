import { Module } from '@nestjs/common';
import { IndiceMedicamentosService } from './indice_medicamentos.service';
import { IndiceMedicamentosController } from './indice_medicamentos.controller';

@Module({
  providers: [IndiceMedicamentosService],
  controllers: [IndiceMedicamentosController]
})
export class IndiceMedicamentosModule {}
