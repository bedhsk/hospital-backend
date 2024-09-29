import { Module } from '@nestjs/common';
import { AdquisicionesService } from './adquisiciones.service';
import { AdquisicionesController } from './adquisiciones.controller';
import { DetalleadquisicionesService } from './detalleadquisiciones/detalleadquisiciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Adquisicion from './entities/adquisicion.entity';
import detalleAdquisicion from './entities/detalleAdquisicion.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { InsumoDepartamento } from '../insumo_departamentos/entities/insumo_departamento.entity';
import { InsumoDepartamentosModule } from '../insumo_departamentos/insumo_departamentos.module';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';
import { UsersService } from 'src/users/users.service';
import User from 'src/users/entities/user.entity';

@Module({
  imports: [
    InsumoDepartamentosModule,
    TypeOrmModule.forFeature([Adquisicion, detalleAdquisicion, InsumoDepartamento, User]),
  ],
  controllers: [AdquisicionesController],
  providers: [
    AdquisicionesService,
    DetalleadquisicionesService,
    InsumoDepartamentosService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    }
  ],
  exports: [AdquisicionesService, DetalleadquisicionesService],
})
export class AdquisicionesModule {}
