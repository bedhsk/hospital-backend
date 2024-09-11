import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

class CreateDepartamentoDto {
  @IsString()
  @MaxLength(255)
  nombre: string; 

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true; 
}

export default CreateDepartamentoDto;
