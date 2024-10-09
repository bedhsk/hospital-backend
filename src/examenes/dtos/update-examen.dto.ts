import { PartialType } from '@nestjs/mapped-types';
import CreateExamenDto from './create-examen.dto';

class UpdateExamenDto extends PartialType(CreateExamenDto) {}

export default UpdateExamenDto;

