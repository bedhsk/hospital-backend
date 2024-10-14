import { PartialType } from '@nestjs/swagger';
import CreateDetalleAdquisicionDto from './create-detalle_adquisicion.dto';

class UpdateDetalleAdquisicionDto extends PartialType(CreateDetalleAdquisicionDto) {}

export default UpdateDetalleAdquisicionDto;