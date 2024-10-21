import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumosService } from './insumos.service';
import { InsumosController } from './insumos.controller';
import Insumo from './entities/insumo.entity';
import { CategoriasModule } from '../categorias/categorias.module';
import { DepartamentosModule } from '../departamentos/departamentos.module';
import { InsumoDepartamentosModule } from '../insumo_departamentos/insumo_departamentos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Insumo]),
    CategoriasModule,
    DepartamentosModule,
    forwardRef(() => InsumoDepartamentosModule),
  ],
  controllers: [InsumosController],
  providers: [InsumosService],
  exports: [InsumosService],
})
export class InsumosModule {}
