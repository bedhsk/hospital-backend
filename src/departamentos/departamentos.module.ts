import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentoService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import Departamento from './entities/departamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Departamento]),
  ],
  providers: [DepartamentoService],
  controllers: [DepartamentosController],
  exports: [DepartamentoService],
})
export class DepartamentosModule {}
