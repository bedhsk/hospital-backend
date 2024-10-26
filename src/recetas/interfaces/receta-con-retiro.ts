// interfaces/receta-con-retiro.interface.ts
import Receta from 'src/recetas/entities/receta.entity';
import Retiro from 'src/retiros/entities/retiro.entity';
import DetalleRetiro from 'src/retiros/entities/detalleRetiro.entity';

export interface RecetaConRetiro extends Receta {
  retiro: {
    id: string;
    detalles: DetalleRetiro[];
  };
}