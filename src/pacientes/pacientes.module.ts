import { Module } from '@nestjs/common';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';
import { AntecedentesService } from './antecedentes/antecedentes.service';
import { AntecedentesController } from './antecedentes/antecedentes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Paciente from './entities/paciente.entity';
import Antecedente from './entities/antecedente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente, Antecedente])],  // Registrar las entidades Paciente y Antecedente
  controllers: [PacientesController, AntecedentesController],  // Controladores a utilizar
  providers: [PacientesService, AntecedentesService],  // Proveedores del servicio
  exports: [PacientesService, AntecedentesService]  // Exportar los servicios para que puedan ser utilizados en otros módulos
})
export class PacientesModule {}
