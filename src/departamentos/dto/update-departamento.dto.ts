import { PartialType } from '@nestjs/swagger';
import CreateDepartamentoDto from './create-departamento.dto';

class UpdateDepartamentoDto extends PartialType(CreateDepartamentoDto) {}

export default UpdateDepartamentoDto;
