import { PartialType } from "@nestjs/mapped-types";
import CreateIndiceInsumoDto from "./create-indice-insumo.dto";

class UpdateIndiceInsumoDto extends PartialType(CreateIndiceInsumoDto) {}

export default UpdateIndiceInsumoDto;
