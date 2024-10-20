import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsUUID, ValidateNested } from "class-validator";
import { In } from "typeorm";

export class InsumoDto {
    @IsUUID()
    @IsNotEmpty()
    insumoId: string;
  
    @IsNumber()
    @IsNotEmpty()
    cantidad: number;
  }

class CreateTransaccionDepartamentoDto {
    @IsUUID()
    @IsNotEmpty()
    departamentoAdquisicionId: string;

    @IsUUID()
    @IsNotEmpty()
    departamentoRetiroId: string;

    @IsUUID()
    @IsNotEmpty()
    usuarioId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InsumoDto)
    @IsNotEmpty()
    insumos: InsumoDto[];
}

export default CreateTransaccionDepartamentoDto;