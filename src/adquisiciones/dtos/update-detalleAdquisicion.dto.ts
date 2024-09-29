import { PartialType } from '@nestjs/swagger';
import CreateDetalleAdquisicionDto from './create-detalleAdquisicion.dto';

class UpdateDetalleAdquisicionDto extends PartialType(CreateDetalleAdquisicionDto) {}

export default UpdateDetalleAdquisicionDto;