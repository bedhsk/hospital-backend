import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import CreateLoteDto from "src/lotes/dto/create-lote.dto";

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
  @Type(() => CreateLoteDto)
  @IsNotEmpty()
  lotes: CreateLoteDto[];
}
