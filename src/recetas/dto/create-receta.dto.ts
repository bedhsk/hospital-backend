import { IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { EstadoReceta } from '../enum/estado-receta.enum';

class CreateRecetaDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  descripcion: string;

  @IsString()
  userId: string;

  @IsString()
  pacienteId: string;

  @IsEnum(EstadoReceta)
  estado: EstadoReceta; // Estado de la receta: Pendiente o Entregado
}

export default CreateRecetaDto;
