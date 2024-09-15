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

@Module({
  imports: [TypeOrmModule.forFeature([Receta, User, Paciente, Role])],
  controllers: [RecetasController],
  providers: [RecetasService, UsersService, PacientesService, RolesService],
})
export class RecetasModule {}