import {
  IsUUID,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateInsumoDepartamentoDto {
  @IsUUID()
  @IsNotEmpty()
  insumoId: string;

  @IsUUID()
  @IsNotEmpty()
  departamentoId: string;

  @IsNumber()
  existencia: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}

export default CreateInsumoDepartamentoDto;
