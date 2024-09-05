import { PartialType } from "@nestjs/mapped-types";
import CreateMovimientoInsumoDto from "./create-movimiento-insumo.dto";

class UpdateMovimientoInsumoDto extends PartialType(CreateMovimientoInsumoDto) {}

export default UpdateMovimientoInsumoDto;
