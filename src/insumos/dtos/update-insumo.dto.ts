import { PartialType } from "@nestjs/mapped-types";
import CreateInsumoDto from "./create-insumo.dto";

class UpdateInsumoDto extends PartialType(CreateInsumoDto) {}

export default UpdateInsumoDto;
