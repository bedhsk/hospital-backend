import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

class CreatePacienteDto {
  @IsUUID()
  @IsOptional()
  antecedenteId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(60)
  nombre: string;

  @IsString()
  @IsIn(['Masculino', 'Femenino'])
  @MaxLength(10)
  sexo: string;

  @IsString()
  @MaxLength(13)
  @IsOptional()
  cui?: string;

  @Type(() => Date)
  @IsDate()
  nacimiento: Date;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  familiares?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  medicos?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  quirurgicos?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  traumaticos?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  alergias?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  vicios?: string;
}

export default CreatePacienteDto;
