import { Type } from "class-transformer";
import { IsDate, IsInt, IsString, MaxLength, Min, IsNotEmpty } from "class-validator";

export default class CreateLoteDto {
    @IsString()
    @MaxLength(50)
    numero_lote: string;

    @IsDate()
    @Type(() => Date) // Transformar cadena a fecha
    fechaFabricacion: Date;

    @IsDate()
    @Type(() => Date) // Transformar cadena a fecha
    fechaCaducidad: Date;

    @IsInt()
    @Min(0)
    cantidad: number;

    @IsInt()
    @IsNotEmpty()
    insumoId: number; // Relación con Insumo
}
