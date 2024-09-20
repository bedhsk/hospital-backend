import { PartialType } from '@nestjs/swagger';
import CreateCategoriaDto from './create-categoria.dto';

class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {}

export default UpdateCategoriaDto;
