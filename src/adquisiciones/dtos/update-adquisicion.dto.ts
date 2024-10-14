import { PartialType } from '@nestjs/swagger';
import CreateAdquisicionDto from './create-adquisicion.dto';

class UpdateAdquisicionDto extends PartialType(CreateAdquisicionDto) {}

export default UpdateAdquisicionDto;