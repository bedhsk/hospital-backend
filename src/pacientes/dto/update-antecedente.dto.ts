import { PartialType } from "@nestjs/mapped-types";
import CreateAntecedenteDto from "./create-antecedente.dto";

class UpdateAntecedenteDto extends PartialType(CreateAntecedenteDto)
{
    
}
export default UpdateAntecedenteDto;