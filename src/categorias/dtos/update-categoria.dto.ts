import { PartialType } from "@nestjs/mapped-types";
import CreateCategoriaDto from "./create-categoria.dto";

class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {}

export default UpdateCategoriaDto;
