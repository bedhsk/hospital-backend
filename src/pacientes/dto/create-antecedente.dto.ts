import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString } from "class-validator";

class CreateAntecedenteDto {

    @IsString()
    pacienteId: string;
    
    @IsInt()
    @IsOptional()
    gestas?: number;
    
    @IsInt()
    @IsOptional()
    hijos_vivos?: number;
    
    @IsInt()
    @IsOptional()
    hijos_muertos?: number;

    @IsInt()
    @IsOptional()
    abortos?: number;

    
    @Type(() => Date) 
    @IsDate()
    @IsOptional()
    ultima_regla?: Date;

    @IsInt()
    @IsOptional()
    planificacion_familiar?: number;

    @IsInt()
    @IsOptional()
    partos?: number;


    @IsInt()
    @IsOptional()
    cesareas?: number;


}

export default CreateAntecedenteDto;