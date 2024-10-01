import { Type } from "class-transformer";
import { IsNumber, IsString, IsOptional } from "class-validator";

class QueryAntecedenteDto {
   
    @IsOptional()
    @IsString()
    filterUser?: string;

    @IsOptional()
    @IsString()
    filterID?: string;
    
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