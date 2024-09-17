import { Type } from "class-transformer";
import { IsNumber, IsString, IsOptional } from "class-validator";

class QueryAntecedenteDto {
   
    @IsOptional()
    @IsString()
    filter?: string;

    @IsOptional()
    @IsString()
    filterCui?: string;

    @IsOptional()
    @IsString()
    filterId?: string;

    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page: number = 1;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit: number = 10;
}

export default QueryAntecedenteDto;