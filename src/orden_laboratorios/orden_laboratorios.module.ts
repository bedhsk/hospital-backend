import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrdenLaboratorio from './entities/orden_laboratorio.entity';
import Paciente from '../pacientes/entities/paciente.entity';
import Examen from '../examenes/entities/examen.entity';
import Retiro from '../retiros/entities/retiro.entity';
import User from 'src/users/entities/user.entity';
import { OrdenLaboratoriosService } from './orden_laboratorios.service';
import { OrdenLaboratoriosController } from './orden_laboratorios.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdenLaboratorio,  // Entidad OrdenLaboratorio
      Paciente,          // Entidad Paciente (FK en OrdenLaboratorio)
      Examen,            // Entidad Examen (FK en OrdenLaboratorio)
      User,           // Entidad Usuario (FK en OrdenLaboratorio)
      Retiro             // Entidad Retiro (FK opcional en OrdenLaboratorio)
    ]),
  ],
  providers: [OrdenLaboratoriosService],  // Servicio de OrdenLaboratorio
  controllers: [OrdenLaboratoriosController],  // Controlador de OrdenLaboratorio
})
export class OrdenLaboratorioModule {}