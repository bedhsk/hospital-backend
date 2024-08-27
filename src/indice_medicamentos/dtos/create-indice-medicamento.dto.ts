import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export default class CreateIndiceMedicamentoDto {
    @IsNumber()
    @IsNotEmpty()
    medicamentoId: number;

    @IsNumber()
    promedio_demanda_real: number;

    @IsNumber()
    existencia_fisica: number;

    @IsNumber()
    existencia_disponible: number;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    puesto: string;
}