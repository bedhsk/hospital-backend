import { PartialType } from "@nestjs/mapped-types";
import CreateLoteDto from "./create-lote.dto";

class UpdateLoteDto extends PartialType(CreateLoteDto) {}

export default UpdateLoteDto;
