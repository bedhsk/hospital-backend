import { IsUUID, IsNumber, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export default class CreateInsumoExamenDto {

  @IsNumber()
  cantidad: number = 0;  // Se inicializa con 0 por defecto

  @IsUUID()
  @IsNotEmpty()
  insumoId: string;  // FK para insumo

  @IsUUID()
  @IsNotEmpty()
  examenId: string;  // FK para examen

  @IsBoolean()
  @IsOptional()
  is_active: boolean = true;  // Se inicializa como true para que el insumo_examen esté activo por defecto
}
