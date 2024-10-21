import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsUUID,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class DepartamentoAsociacionDto {
  @IsUUID()
  @IsNotEmpty()
  departamentoId: string;

  @IsNumber()
  @IsNotEmpty()
  existencia: number;
}

export class CreateInsumoDto {
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

  @IsUUID()
  @IsNotEmpty()
  categoriaId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DepartamentoAsociacionDto)
  departamentos: DepartamentoAsociacionDto[];
}

export default CreateInsumoDto;
