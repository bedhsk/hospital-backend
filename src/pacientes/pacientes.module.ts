import { Module } from '@nestjs/common';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';
import { AntecedentesService } from './antecedentes/antecedentes.service';
import { AntecedentesController } from './antecedentes/antecedentes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Paciente from './entities/paciente.entity';
import Antecedente from './entities/antecedente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente, Antecedente])],
  controllers: [PacientesController, AntecedentesController],
  providers: [PacientesService, AntecedentesService],
  exports: [PacientesService],
})
export class PacientesModule {}
