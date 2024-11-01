import { Type } from "class-transformer";
import { IsString, MinLength, MaxLength, IsOptional, IsArray, ValidateNested, IsNotEmpty, IsUUID } from "class-validator";
import { DetalleRetiroDto } from "./create-retiro.dto";

export default class CreateRetiroExamenDto {
    @IsUUID()
    @IsNotEmpty()
    usuarioId: string;

    @IsUUID()
    @IsNotEmpty()
    departamentoId: string;

    @IsString()
    @MinLength(1)
    @MaxLength(255)
    @IsOptional()
    descripcion?: string;   
    
    @IsUUID()
    @IsNotEmpty()
    examenId: string;
}