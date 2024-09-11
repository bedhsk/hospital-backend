import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsString, MaxLength, Min, IsOptional, IsDate, IsNotEmpty } from "class-validator";

export default class CreateMovimientoInsumoDto {
    @IsDate()
    @Type(() => Date) // Transforma la cadena a instancia de Date
    fecha: Date;

    @IsInt()
    @Min(0)
    cantidad: number;

    @IsBoolean()
    ingreso: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    descripcion?: string;

    @IsInt()
    @IsNotEmpty()
    insumoId: number; // Relación con Insumo
}
