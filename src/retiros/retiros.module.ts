import { Module } from '@nestjs/common';
import { RetirosService } from './retiros.service';
import { RetirosController } from './retiros.controller';
import { DetalleretirosService } from './detalleretiros/detalleretiros.service';
import { InsumoDepartamentosModule } from 'src/insumo_departamentos/insumo_departamentos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import DetalleRetiro from './entities/detalleRetiro.entity';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import Retiro from './entities/retiro.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role.guard';
import OrdenLaboratorio from 'src/orden_laboratorios/entities/orden_laboratorio.entity';
import Adquisicion from 'src/adquisiciones/entities/adquisicion.entity';
import { AdquisicionesModule } from 'src/adquisiciones/adquisiciones.module';
import { DepartamentosModule } from 'src/departamentos/departamentos.module';

@Module({

  imports: [
    InsumoDepartamentosModule,
    UsersModule,
    AdquisicionesModule,
    DepartamentosModule,
    TypeOrmModule.forFeature([
      DetalleRetiro,
      InsumoDepartamento,
      Retiro,
      OrdenLaboratorio,
      Adquisicion
    ]),
  ],
  providers: [RetirosService, DetalleretirosService
  ],
  controllers: [RetirosController],
  exports: [RetirosService, DetalleretirosService,]
})
export class RetirosModule {}
