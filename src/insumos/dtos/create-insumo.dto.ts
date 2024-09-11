import { IsString, IsBoolean, IsUUID, MaxLength, IsNotEmpty, IsOptional } from 'class-validator';

export default class CreateInsumoDto {
    @IsUUID()
    @IsNotEmpty()
    categoriaId: string; 

    @IsString()
    @MaxLength(12)
    @IsNotEmpty()
    codigo: string; 

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    nombre: string;  

    @IsBoolean()
    trazador: boolean = false;  

    @IsBoolean()
    @IsOptional()
    is_active?: boolean = true; 
}
