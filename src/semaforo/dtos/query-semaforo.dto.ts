import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

class QuerySemaforoDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  filter?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number = 10;
}

export default QuerySemaforoDto;
