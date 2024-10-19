import { IsString, MinLength, MaxLength } from 'class-validator';

class CreateRecetaDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  descripcion: string;

  @IsString()
  userId: string;

  @IsString()
  pacienteId: string;
}

export default CreateRecetaDto;
