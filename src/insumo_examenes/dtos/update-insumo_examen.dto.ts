import { PartialType } from '@nestjs/mapped-types';
import CreateInsumoExamenDto from './create-insumo_examen.dto';

class UpdateInsumoExamenDto extends PartialType(CreateInsumoExamenDto) {}

export default UpdateInsumoExamenDto;
