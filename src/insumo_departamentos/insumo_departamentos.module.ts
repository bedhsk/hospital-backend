import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumoDepartamentosService } from './insumo_departamentos.service';
import { InsumoDepartamentosController } from './insumo_departamentos.controller';
import { InsumoDepartamento } from './entities/insumo_departamento.entity';
import { DepartamentosModule } from '../departamentos/departamentos.module';
import { InsumosModule } from '../insumos/insumos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InsumoDepartamento]),
    DepartamentosModule,
    forwardRef(() => InsumosModule),
  ],
  controllers: [InsumoDepartamentosController],
  providers: [InsumoDepartamentosService],
  exports: [InsumoDepartamentosService],
})
export class InsumoDepartamentosModule {}
