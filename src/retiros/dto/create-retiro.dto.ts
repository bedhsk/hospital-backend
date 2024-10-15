import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";

 export class DetalleRetiroDto {
    @IsUUID()
    @IsNotEmpty()
    insumoDepartamentoId: string;
  
    @IsNumber()
    @IsNotEmpty()
    cantidad: number;
  }
class CreateRetiroDto {

    @IsString()
    usuarioId: string;

    @IsString()
    @MinLength(1)
    @MaxLength(255)
    @IsOptional()
    descripcion?: string;   



    @IsString()
    @IsOptional()
    insumoDepartamentoId: string;

    @IsNumber()
    @IsOptional()
    cantidad: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleRetiroDto)
    @IsOptional()
    detalles: DetalleRetiroDto[];
}

export default CreateRetiroDto;