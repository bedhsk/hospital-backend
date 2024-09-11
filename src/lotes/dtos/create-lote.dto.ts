import { Type } from 'class-transformer';
import { IsDate, IsInt, IsString, MaxLength, Min, IsUUID, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export default class CreateLoteDto {
    @IsString()
    @MaxLength(50)
    numeroLote: string;  

    @IsDate()
    @Type(() => Date)  
    fechaFabricacion: Date;  

    @IsDate()
    @Type(() => Date)  
    fechaCaducidad: Date;  

    @IsInt()
    @Min(0)
    cantidad: number;  

    @IsUUID()
    @IsNotEmpty()
    insumoId: string;  

    @IsUUID()
    @IsNotEmpty()
    insumoDepartamentoId: string;  

    @IsString()
    @IsOptional()
    status?: string; 

    @IsBoolean()
    @IsOptional()
    is_active?: boolean = true;  
}
