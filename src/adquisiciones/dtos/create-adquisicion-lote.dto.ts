import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";


export class createLote {
  @IsUUID()
  @IsNotEmpty()
  insumoId: string;

  @IsNumber()
  @IsNotEmpty()
  cantidadInical: number;

  @IsString()
  @MaxLength(50)
  numeroLote: string;

  @IsDate()
  @Type(() => Date)
  fechaCaducidad: Date;
}

export default class CreateAdquisicionLoteDto {
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
  @Type(() => createLote)
  @IsNotEmpty()
  lotes: createLote[];
}
