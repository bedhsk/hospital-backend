import { Type } from "class-transformer";
import { IsNumber, IsString, IsOptional } from "class-validator";

class QueryRetiroDto {
   
    @IsOptional()
    @IsString()
    q?: string;

    @IsOptional()
    @IsString()
    filterDepartamento?: string;
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page: number = 1;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit: number = 10;
}

export default QueryRetiroDto;