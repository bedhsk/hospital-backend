import { Module } from '@nestjs/common';
import { InsumoDepartamentosService } from './insumo_departamentos.service';
import { InsumoDepartamentosController } from './insumo_departamentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumoDepartamento } from './entities/insumo_departamento.entity';
import Departamento from 'src/departamentos/entities/departamento.entity';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import Insumo from 'src/insumos/entities/insumo.entity';
import { InsumosService } from 'src/insumos/insumos.service';
import Categoria from 'src/categorias/entities/categoria.entity';
import { CategoriasService } from 'src/categorias/categorias.service';
import DetalleRetiro from 'src/retiros/entities/detalleRetiro.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      InsumoDepartamento,
      Insumo,
      Categoria,
      Departamento,
      DetalleRetiro
    ]),
  ],
  controllers: [InsumoDepartamentosController],
  providers: [
    InsumoDepartamentosService,
    InsumosService,
    DepartamentosService,
    CategoriasService,
  ],
  exports: [InsumoDepartamentosService, InsumosService],
})
export class InsumoDepartamentosModule {}
