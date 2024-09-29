import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export default class CreateAdquisicionDto {
  @IsString()
  @IsNotEmpty()
  usuarioId: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  descripcion: string; 

  // Atributos para crear detalle adquisicion

  @IsString()
  @IsNotEmpty()
  insumoDepartamentoId: string;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;
}