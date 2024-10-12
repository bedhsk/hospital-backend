import {
  IsUUID,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export default class CreateExamenDto {
  @IsString() // Validación para que sea un string
  @MaxLength(50) // Longitud máxima de 50 caracteres
  @IsNotEmpty() // Validación para que no esté vacío
  nombre: string;

  @IsString() // Validación para que sea un string
  @MaxLength(255) // Longitud máxima de 255 caracteres
  descripcion: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean = true; // Se inicializa como true para que el examen esté activo por defecto
}
