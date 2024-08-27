import { PartialType } from "@nestjs/mapped-types";
import CreateIndiceMedicamentoDto from "./create-indice-medicamento.dto";


class UpdateIndiceMedicamentoDto extends PartialType(CreateIndiceMedicamentoDto){}

export default UpdateIndiceMedicamentoDto;