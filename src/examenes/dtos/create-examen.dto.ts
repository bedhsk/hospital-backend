import {
  IsUUID,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import CreateInsumoExamenDto from 'src/insumo_examenes/dtos/create-insumo_examen.dto';

class CreateExamenDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @MaxLength(255)
  descripcion: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsumoExamenDto)
  insumos: InsumoExamenDto[]; // Array con insumoId y cantidad
}
class InsumoExamenDto {
  @IsUUID()
  insumoId: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  cada_horas: number;

  @IsNumber()
  por_dias: number;
}

export default CreateExamenDto;
