import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsUUID,
} from 'class-validator';

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
}

export default CreateInsumoDto;
