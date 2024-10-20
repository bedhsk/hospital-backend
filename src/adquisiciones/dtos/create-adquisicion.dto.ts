import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";

export class DetalleAdquisicionDto {
  @IsUUID()
  @IsNotEmpty()
  insumoDepartamentoId: string;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;
}

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleAdquisicionDto)
  @IsNotEmpty()
  detalles: DetalleAdquisicionDto[];
}