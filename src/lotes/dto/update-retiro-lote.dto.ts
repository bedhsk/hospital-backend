import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from "class-validator";

export default class UpdateRetiroLoteDto {
    @IsInt()
    @Min(0)
    cantidad: number;
    
    @IsString()
    @IsNotEmpty()
    numeroLote: string;

    @IsUUID()
    @IsNotEmpty()
    id: string;
}