import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";


class DetalleRetiroDto {
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
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleRetiroDto)
    @IsNotEmpty()
    detalles: DetalleRetiroDto[];



}

export default CreateRetiroDto;