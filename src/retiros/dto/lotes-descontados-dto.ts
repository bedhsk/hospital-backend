import { IsNotEmpty, IsNumber, IsString } from "class-validator";

class LoteDescontado {
    @IsString()
    @IsNotEmpty()
    numeroLote: string;
    @IsNumber()
    @IsNotEmpty()
    cantidadDescontada: number;
}

export default LoteDescontado;

