import { IsInt, IsString, MaxLength, Min, IsNotEmpty } from "class-validator";

export default class CreateIndiceInsumoDto {
    @IsInt()
    @Min(0)
    promedio_demanda_real: number;

    @IsInt()
    @Min(0)
    existencia_fisica: number;

    @IsString()
    @MaxLength(50)
    puesto: string;

    @IsInt()
    @IsNotEmpty()
    insumoId: number;
}
