import {
  IsUUID,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
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

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}

export default CreateInsumoExamenDto;
