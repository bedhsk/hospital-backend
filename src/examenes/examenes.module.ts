import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamenesService } from './examenes.service';
import { ExamenesController } from './examenes.controller';
import Examen from './entities/examen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Examen])],  // Registro del repositorio para la entidad Examen
  providers: [ExamenesService],  // Proveedor del servicio de Examenes
  controllers: [ExamenesController],  // Controlador de Examenes
  exports: [ExamenesService],  // Exportar el servicio si es necesario en otros módulos
})
export class ExamenesModule {}
