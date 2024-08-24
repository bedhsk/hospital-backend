import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, ValidateNested, isNumber } from "class-validator";


import CreateRoleDto from "./create-role.dto";

import { RelationId } from "typeorm";
class CreateUserDto {

    @IsString()
    @MinLength(1)
    @MaxLength(60)
    name: string;
    
    @IsString()
    @MinLength(1)
    @MaxLength(60)
    lastname: string;
    
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    username: string;
    
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;    


    @IsNumber()
    roleId: number;
 


}

export default CreateUserDto;