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

@Module({

  imports: [
    InsumoDepartamentosModule,
    UsersModule,
    TypeOrmModule.forFeature([
      DetalleRetiro,
      InsumoDepartamento,
      Retiro,
    ]),
  ],
  providers: [RetirosService, DetalleretirosService
  ],
  controllers: [RetirosController],
  exports: [RetirosService]
})
export class RetirosModule {}
