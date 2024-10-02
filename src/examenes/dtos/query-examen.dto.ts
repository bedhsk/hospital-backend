import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

class QueryExamenDto {
  @IsOptional()
  @IsString()
  nombre?: string;  // Campo opcional para buscar por nombre

  @IsOptional()
  @IsUUID()
  id?: string;  // Campo opcional para buscar por ID

  @IsOptional()
  @IsNumber()
  @Type(() => Number)  // Convertir el valor recibido a número
  page: number = 1;  // Número de página para paginación (opcional)

  @IsOptional()
  @IsNumber()
  @Type(() => Number)  // Convertir el valor recibido a número
  limit: number = 10;  // Límite de resultados por página (opcional)
}

export default QueryExamenDto;