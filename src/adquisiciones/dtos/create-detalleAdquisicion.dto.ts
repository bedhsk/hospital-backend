import {
  IsUUID,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export default class CreateDetalleAdquisicionDto {
  @IsUUID()
  @IsNotEmpty()
  adquisicionId: string;

  @IsUUID()
  @IsNotEmpty()
  insumoDepartamentoId: string;
  
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
  
  @IsNumber()
  @IsNotEmpty()
  cantidad: number;
}
