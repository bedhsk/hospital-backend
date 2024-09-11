import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InsumosModule } from '../insumos/insumos.module';
import { DepartamentosModule } from '../departamentos/departamentos.module';
import InsumoDepartamento from './entities/insumo_departamento.entity';
import { InsumoDepartamentoService } from './insumo_departamentos.service';
import { InsumoDepartamentoController } from './insumo_departamentos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([InsumoDepartamento]),
    InsumosModule,
    DepartamentosModule,
  ],
  providers: [InsumoDepartamentoService],
  controllers: [InsumoDepartamentoController],
  exports: [InsumoDepartamentoService],
})
export class InsumoDepartamentoModule {}
