import { PartialType } from "@nestjs/mapped-types";
import CreateRetiroDto from "./create-retiro.dto";


class UpdateRetiroDto extends PartialType(CreateRetiroDto)
{
    
}
export default UpdateRetiroDto;