import { Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsDate,
  IsInt,
  Min,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

class CreateLoteDto {
  @IsString()
  @MaxLength(50)
  numeroLote: string;

  @IsDate()
  @Type(() => Date)
  fechaEntrada: Date;

  @IsDate()
  @Type(() => Date)
  fechaCaducidad: Date;

  @IsInt()
  @Min(0)
  cantidadInical: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  cantidadActual: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @IsUUID()
  @IsNotEmpty()
  insumoDepartamentoId: string;
}

export default CreateLoteDto;
