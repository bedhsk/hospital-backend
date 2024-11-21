import {
  IsUUID,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

class CreateInsumoExamenDto {
  @IsUUID()
  @IsNotEmpty()
  insumoId: string;

  @IsUUID()
  examenId: string;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsOptional()
  @IsString()
  uso: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}

export default CreateInsumoExamenDto;
