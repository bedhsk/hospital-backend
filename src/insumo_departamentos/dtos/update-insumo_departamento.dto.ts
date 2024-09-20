import { PartialType } from '@nestjs/mapped-types';
import CreateInsumoDepartamentoDto from './create-insumo_departamento.dto';

class UpdateInsumoDepartamentoDto extends PartialType(CreateInsumoDepartamentoDto) {}

export default UpdateInsumoDepartamentoDto;
