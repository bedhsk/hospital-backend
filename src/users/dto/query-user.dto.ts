import { Type } from "class-transformer";
import { IsNumber, IsString, IsOptional } from "class-validator";

class QueryUserDto {

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

export default QueryUserDto;