import { IsString, MaxLength, MinLength } from "class-validator";

class CreateRoleDto {

    @IsString()
    @MinLength(1)
    @MaxLength(60)
    name: string;
}
export default CreateRoleDto;