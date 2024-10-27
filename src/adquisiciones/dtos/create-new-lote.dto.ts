import { Type } from "class-transformer";
import { IsUUID, IsNotEmpty, IsNumber, IsString, MaxLength, IsDate } from "class-validator";

export default class createNewLoteDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;
    
    @IsUUID()
    @IsNotEmpty()
    insumoId: string;
  
    @IsNumber()
    @IsNotEmpty()
    cantidadInical: number;
  
    @IsString()
    @MaxLength(50)
    numeroLote: string;
  
    @IsDate()
    @Type(() => Date)
    fechaCaducidad: Date;
  }