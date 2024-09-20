import { PartialType } from '@nestjs/swagger';
import CreateInsumoDepartamentoDto from './create-insumo_departamento.dto';

class UpdateInsumoDepartamentoDto extends PartialType(
  CreateInsumoDepartamentoDto,
) {}

export default UpdateInsumoDepartamentoDto;
