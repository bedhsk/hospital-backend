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
import OrdenLaboratorio from 'src/orden_laboratorios/entities/orden_laboratorio.entity';
import Adquisicion from 'src/adquisiciones/entities/adquisicion.entity';
import { AdquisicionesModule } from 'src/adquisiciones/adquisiciones.module';
import { DepartamentosModule } from 'src/departamentos/departamentos.module';
import { LotesModule } from 'src/lotes/lotes.module';

@Module({
  imports: [
    InsumoDepartamentosModule,
    UsersModule,
    AdquisicionesModule,
    DepartamentosModule,
    LotesModule,
    TypeOrmModule.forFeature([
      DetalleRetiro,
      InsumoDepartamento,
      Retiro,
      OrdenLaboratorio,
      Adquisicion,
    ]),
  ],
  providers: [RetirosService, DetalleretirosService],
  controllers: [RetirosController],
  exports: [RetirosService],
})
export class RetirosModule {}
