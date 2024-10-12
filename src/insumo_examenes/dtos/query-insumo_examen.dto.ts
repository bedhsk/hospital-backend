import { IsOptional, IsUUID, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class QueryInsumoExamenDto {

  @IsOptional()
  @IsUUID()
  insumoId?: string;  // Campo opcional para filtrar por insumoId

  @IsOptional()
  @IsUUID()
  examenId?: string;  // Campo opcional para filtrar por examenId

  @IsOptional()
  @IsNumber()
  @Type(() => Number)  // Convertir el valor recibido a número
  page?: number = 1;  // Número de página para la paginación (opcional)

  @IsOptional()
  @IsNumber()
  @Type(() => Number)  // Convertir el valor recibido a número
  limit?: number = 10;  // Límite de resultados por página (opcional)

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;  // Filtrar por estado activo/inactivo
}

export default QueryInsumoExamenDto;