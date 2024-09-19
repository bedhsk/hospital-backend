import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

class CreateDepartamentoDto {
  @IsString()
  @MaxLength(255)
  nombre: string;
}

export default CreateDepartamentoDto;
