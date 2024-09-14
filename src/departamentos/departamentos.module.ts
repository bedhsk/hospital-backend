import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import Departamento from './entities/departamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Departamento]),
  ],
  providers: [DepartamentosService],
  controllers: [DepartamentosController],
  exports: [DepartamentosService],
})
export class DepartamentosModule {}
