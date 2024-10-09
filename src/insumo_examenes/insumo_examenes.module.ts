import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumoExamenesService } from './insumo_examenes.service';
import { InsumoExamenesController } from './insumo_examenes.controller';
import InsumoExamen from './entities/insumo_examen.entity';
import Insumo from 'src/insumos/entities/insumo.entity';
import Examen from 'src/examenes/entities/examen.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InsumoExamen, Insumo, Examen]), // Registrar las entidades InsumoExamen, Insumo y Examen
  ],
  providers: [InsumoExamenesService],  // Proveedor del servicio
  controllers: [InsumoExamenesController],  // Controlador del módulo
  exports: [InsumoExamenesService],  // Exportar el servicio si es necesario en otros módulos
})
export class InsumoExamenesModule {}
