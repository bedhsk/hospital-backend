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
  fechaFabricacion: Date;

  @IsDate()
  @Type(() => Date)
  fechaCaducidad: Date;

  @IsInt()
  @Min(0)
  cantidad: number;

  @IsUUID()
  @IsNotEmpty()
  insumoDepartamentoId: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}

export default CreateLoteDto;
