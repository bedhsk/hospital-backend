import { PartialType } from "@nestjs/mapped-types";
import CreateMedicamentoDto from "./create-medicamento.dto";


class UpdateMedicamentoDto extends PartialType(CreateMedicamentoDto) {}

export default UpdateMedicamentoDto;