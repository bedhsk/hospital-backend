import {
  IsUUID,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export default class CreateMovimientoLoteDto {
  @IsUUID()
  @IsNotEmpty()
  loteId: string;

  @IsUUID()
  @IsOptional()
  detalleAdquisicionId?: string;

  @IsUUID()
  @IsOptional()
  detalleRetiroId?: string;
  
  @IsNumber()
  @IsNotEmpty()
  cantidad: number;
}