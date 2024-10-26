import { IsString, MinLength, MaxLength, IsEnum, IsUUID, IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { EstadoReceta } from '../enum/estado-receta.enum';
import { Type } from 'class-transformer';


export class DetalleRetiroDto {
  @IsUUID()
  @IsNotEmpty()
  insumoId: string;

  @IsUUID()
  @IsNotEmpty()
  departamentoId: string;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;
}
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

  // Atributos para crear el detalle del retiro
  @IsArray()
  @ValidateNested({ each: true })
  @Type (() => DetalleRetiroDto)
  @IsNotEmpty()
  detalles: DetalleRetiroDto[];
}

export default CreateRecetaDto;
