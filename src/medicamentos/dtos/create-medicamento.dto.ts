import { IsBoolean, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export default class CreateMedicamentoDto {
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
    @MinLength(1)
    @MaxLength(100)
    categoria: string;
}