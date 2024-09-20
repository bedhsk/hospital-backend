import { IsString, MaxLength } from 'class-validator';

class CreateCategoriaDto {
  @IsString()
  @MaxLength(255)
  nombre: string;
}

export default CreateCategoriaDto;
