import { PartialType } from '@nestjs/swagger';
import { CreateInsumoDto } from './create-insumo.dto';

class UpdateInsumoDto extends PartialType(CreateInsumoDto) {}

export default UpdateInsumoDto;
