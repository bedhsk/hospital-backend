import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

class QueryDepartamentoDto {
  @IsOptional()
  @IsString()
  query?: string;

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

export default QueryDepartamentoDto;