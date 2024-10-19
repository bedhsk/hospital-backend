import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamenesService } from './examenes.service';
import { ExamenesController } from './examenes.controller';
import Examen from './entities/examen.entity';
import { InsumoExamenesModule } from 'src/insumo_examenes/insumo_examenes.module'; // Importar el módulo de InsumoExamenes

@Module({
  imports: [
    TypeOrmModule.forFeature([Examen]),  // Registrar la entidad Examen
    InsumoExamenesModule,  // Importar el módulo de InsumoExamenes para acceder a InsumoExamenRepository
  ],
  providers: [ExamenesService],  // Proveedor del servicio de Examenes
  controllers: [ExamenesController],  // Controlador de Examenes
  exports: [ExamenesService],  // Exportar el servicio de Examenes
})
export class ExamenesModule {}
