import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";

 export class DetalleRetiroPublicDto {
    @IsUUID()
    @IsNotEmpty()
    insumoId: string;
  
    @IsNumber()
    @IsNotEmpty()
    cantidad: number;
  }
class CreateRetiroPublicDto {

    @IsString()
    usuarioId: string;

    @IsString()
    @MinLength(1)
    @MaxLength(255)
    @IsOptional()
    descripcion?: string;   
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleRetiroPublicDto)
    @IsNotEmpty()
    detalles: DetalleRetiroPublicDto[];
}
export default CreateRetiroPublicDto;