import { IsBoolean, IsString, MinLength, MaxLength } from "class-validator";

export default class CreateInsumoDto {
    @IsBoolean()
    trazador: boolean;

    @IsString()
    @MinLength(1)
    @MaxLength(12)
    codigo: string;

    @IsString()
    @MinLength(1)
    @MaxLength(255)
    nombre: string;

    @IsString()
    @MaxLength(100)
    categoria: string;

    @IsString()
    @MaxLength(100)
    departamento: string;
}