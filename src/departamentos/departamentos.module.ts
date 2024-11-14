import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import Departamento from './entities/departamento.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Departamento]),
    EventEmitterModule.forRoot(),
  ],
  providers: [DepartamentosService],
  controllers: [DepartamentosController],
  exports: [DepartamentosService],
})
export class DepartamentosModule {}
