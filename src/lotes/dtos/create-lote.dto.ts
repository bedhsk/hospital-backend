import { IsDate, IsInt, IsString, MaxLength, Min, IsNotEmpty } from "class-validator";

export default class CreateLoteDto {
    @IsString()
    @MaxLength(50)
    numero_lote: string;

    @IsDate()
    fechaFabricacion: Date;

    @IsDate()
    fechaCaducidad: Date;

    @IsInt()
    @Min(0)
    cantidad: number;

    @IsInt()
    @IsNotEmpty()
    insumoId: number; // Relación con Insumo
}
