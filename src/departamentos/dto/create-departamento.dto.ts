import { IsString, MaxLength, MinLength } from 'class-validator';

class CreateDepartamentoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  nombre: string;
}

export default CreateDepartamentoDto;
