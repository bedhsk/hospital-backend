import { Module } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import Receta from './entities/receta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/users/entities/user.entity';
import Paciente from 'src/pacientes/entities/paciente.entity';
import { UsersService } from 'src/users/users.service';
import { PacientesService } from 'src/pacientes/pacientes.service';
import { RolesService } from 'src/users/roles/roles.service';
import Role from 'src/users/entities/role.entity';
import Departamento from 'src/departamentos/entities/departamento.entity';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import Antecedente from 'src/pacientes/entities/antecedente.entity';
import { AntecedentesService } from 'src/pacientes/antecedentes/antecedentes.service';
import { ExamenesModule } from 'src/examenes/examenes.module';
import { RetirosModule } from 'src/retiros/retiros.module';

@Module({
  imports: [
    ExamenesModule,
    RetirosModule,
    TypeOrmModule.forFeature([
      Receta,
      User,
      Paciente,
      Role,
      Departamento,
      Antecedente,
    ]),
  ],
  controllers: [RecetasController],
  providers: [
    RecetasService,
    UsersService,
    PacientesService,
    RolesService,
    DepartamentosService,
    AntecedentesService,
  ],
})
export class RecetasModule {}
