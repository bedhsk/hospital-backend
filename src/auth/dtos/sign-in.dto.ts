import { IsString } from "class-validator";

class SignInDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}

export default SignInDto;