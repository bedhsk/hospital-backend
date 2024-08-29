import { Type } from "class-transformer";
import { IsNumber, IsString, IsOptional } from "class-validator";

class QueryUserDto {

    @IsOptional()
    @IsString()
    name?: string;
    
    @IsOptional()
    @IsString()
    role?: string;
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    currentPage: number = 1;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit: number = 10;
}

export default QueryUserDto;