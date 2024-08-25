import { PartialType } from "@nestjs/mapped-types";
import CreateRoleDto from "./create-role.dto";


class UpdateRoleDto extends PartialType(CreateRoleDto)
{
    
}
export default UpdateRoleDto;