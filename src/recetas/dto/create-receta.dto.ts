import {
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { EstadoReceta } from '../enum/estado-receta.enum';
import { Type } from 'class-transformer';

export class InsumosDto {
  @IsUUID()
  @IsNotEmpty()
  insumoId: string;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsString()
  @IsNotEmpty()
  uso: string;
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

  @IsUUID()
  @IsOptional()
  retiroId?: string;

  @IsEnum(EstadoReceta)
  @IsOptional()
  estado: EstadoReceta = EstadoReceta.PENDIENTE; // Estado de la receta: Pendiente o Entregado

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsumosDto)
  @IsNotEmpty()
  insumos: InsumosDto[];
}

export default CreateRecetaDto;
