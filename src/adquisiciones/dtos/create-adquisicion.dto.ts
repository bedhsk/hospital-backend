import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";
import createNewLoteDto from "./create-new-lote.dto";

export class DetalleAdquisicionDto {
  @IsUUID()
  @IsNotEmpty()
  insumoId: string;

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

  @IsUUID()
  @IsNotEmpty()
  departamentoId: string;

  // Atributos para crear detalle adquisicion
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleAdquisicionDto)
  @IsNotEmpty()
  detalles: DetalleAdquisicionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleAdquisicionDto)
  @IsOptional()
  lotes: createNewLoteDto[] = null;
}