import { PartialType } from '@nestjs/mapped-types';
import CreateOrdenLaboratorioDto from './create-orden-laboratorio.dto';

class UpdateOrdenLaboratorioDto extends PartialType(CreateOrdenLaboratorioDto) {}

export default UpdateOrdenLaboratorioDto;
