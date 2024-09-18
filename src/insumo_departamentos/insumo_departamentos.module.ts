import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import InsumoDepartamento from './entities/insumo_departamento.entity';
import Insumo from 'src/insumos/entities/insumo.entity';
import Departamento from 'src/departamentos/entities/departamento.entity';
import { InsumoDepartamentoService } from './insumo_departamentos.service';
import { InsumoDepartamentoController } from './insumo_departamentos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([InsumoDepartamento, Insumo, Departamento]),  // Importamos las entidades necesarias
  ],
  providers: [InsumoDepartamentoService],
  controllers: [InsumoDepartamentoController],
})
export class InsumoDepartamentoModule {}
