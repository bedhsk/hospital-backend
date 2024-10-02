import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

class CreateRetiroDto {

    @IsString()
    usuarioId: string;

    @IsString()
    @MinLength(1)
    @MaxLength(255)
    @IsOptional()
    descripcion?: string;   



    @IsString()
    insumoDepartamentoId: string;

    @IsNumber()
    cantidad: number;
}

export default CreateRetiroDto;