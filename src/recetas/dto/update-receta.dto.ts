import { PartialType } from '@nestjs/swagger';
import CreateRecetaDto from './create-receta.dto';

class UpdateRecetaDto extends PartialType(CreateRecetaDto) {}

export default UpdateRecetaDto;
