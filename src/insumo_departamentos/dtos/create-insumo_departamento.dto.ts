import { IsUUID, IsNumber, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export default class CreateInsumoDepartamentoDto {
    @IsUUID()
    @IsNotEmpty()
    insumoId: string; 

    @IsUUID()
    @IsNotEmpty()
    departamentoId: string; 

    @IsNumber()
    existencia: number; 

    @IsBoolean()
    @IsOptional()
    is_active?: boolean = true; 
}
