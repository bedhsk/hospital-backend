import { IsEmail, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

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

    @IsString()
    roleId: string;

    @IsUUID()
    departamentoId: string;
}

export default CreateUserDto;