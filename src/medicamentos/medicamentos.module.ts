import { Module } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import { MedicamentosController } from './medicamentos.controller';

@Module({
  providers: [MedicamentosService],
  controllers: [MedicamentosController]
})
export class MedicamentosModule {}
