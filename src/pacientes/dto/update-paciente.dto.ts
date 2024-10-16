import { PartialType } from "@nestjs/mapped-types";
import { CreatePacienteDto } from "./create-paciente.dto";

class UpdatePacienteDto extends PartialType(CreatePacienteDto)
{
    
}
export default UpdatePacienteDto;