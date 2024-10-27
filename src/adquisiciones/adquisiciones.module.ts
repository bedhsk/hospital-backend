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
import { LotesModule } from 'src/lotes/lotes.module';
import { DepartamentosModule } from 'src/departamentos/departamentos.module';
import Lote from 'src/lotes/entities/lote.entity';

@Module({
  imports: [
    InsumoDepartamentosModule,
    UsersModule,
    LotesModule,
    InsumoDepartamentosModule,
    DepartamentosModule,
    TypeOrmModule.forFeature([
      detalleAdquisicion,
      InsumoDepartamento,
      Adquisicion,
      Lote
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
