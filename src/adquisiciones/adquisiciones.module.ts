import { Module } from '@nestjs/common';
import { AdquisicionesService } from './adquisiciones.service';
import { AdquisicionesController } from './adquisiciones.controller';
import { DetalleadquisicionesService } from './detalleadquisiciones/detalleadquisiciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import detalleAdquisicion from './entities/detalle_adquisicion.entity';
import Adquisicion from './entities/adquisicion.entity';
import { InsumoDepartamentosModule } from 'src/insumo_departamentos/insumo_departamentos.module';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role.guard';

@Module({
  imports: [
    InsumoDepartamentosModule,
    UsersModule,
    TypeOrmModule.forFeature([
      detalleAdquisicion,
      InsumoDepartamento,
      Adquisicion,
    ]),
  ],
  providers: [ 
    AdquisicionesService, 
    DetalleadquisicionesService,
    {
      provide: APP_GUARD, 
      useClass: JwtGuard,
    },
    {
        provide: APP_GUARD, 
        useClass: RoleGuard,
    }
    ],
  controllers: [AdquisicionesController],
  exports: [AdquisicionesService]
})
export class AdquisicionesModule {}
