import { Type } from "class-transformer";
import { IsUUID, IsNotEmpty, IsNumber, IsString, MaxLength, IsDate } from "class-validator";

export class createNewLoteDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;
    
    @IsUUID()
    @IsNotEmpty()
    insumoId: string;
  
    @IsString()
    @MaxLength(50)
    numeroLote: string;

    @IsNumber()
    @IsNotEmpty()
    cantidadInical: number;
  
    @IsDate()
    @Type(() => Date)
    fechaCaducidad: Date;
}