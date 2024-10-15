import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";
<<<<<<< HEAD
=======


class DetalleRetiroDto {
    @IsUUID()
    @IsNotEmpty()
    insumoDepartamentoId: string;
  
    @IsNumber()
    @IsNotEmpty()
    cantidad: number;
  }
>>>>>>> develop

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
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleRetiroDto)
    @IsNotEmpty()
    detalles: DetalleRetiroDto[];



<<<<<<< HEAD
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
=======
>>>>>>> develop
}

export default CreateRetiroDto;