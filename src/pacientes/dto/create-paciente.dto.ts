import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import Receta from 'src/recetas/entities/receta.entity';

// DTO para la entidad Antecedentes
class AntecedenteDto {
  @IsInt()
  @IsOptional()
  gestas?: number;

  @IsInt()
  @IsOptional()
  hijos_vivos?: number;

  @IsInt()
  @IsOptional()
  hijos_muertos?: number;

  @IsInt()
  @IsOptional()
  abortos?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  ultima_regla?: Date;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  planificacion_familiar?: string;

  @IsInt()
  @IsOptional()
  partos?: number;

  @IsInt()
  @IsOptional()
  cesareas?: number;
}

// DTO para la entidad Paciente
class CreatePacienteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsIn(['Masculino', 'Femenino'])
  @MaxLength(10)
  @IsNotEmpty()
  sexo: string;

  @IsString()
  @MaxLength(13)
  @IsOptional()
  cui?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  municipio?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  comunidad?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  telefono?: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  nacimiento: Date;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  familiares?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  medicos?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  quirurgicos?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  traumaticos?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  alergias?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  vicios?: string;

  // Atributos del antecedente
  @IsOptional()
  @ValidateNested()
  @Type(() => AntecedenteDto)
  antecedente?: AntecedenteDto;
}

export { CreatePacienteDto };
