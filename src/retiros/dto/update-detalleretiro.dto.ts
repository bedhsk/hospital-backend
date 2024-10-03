import { PartialType } from "@nestjs/mapped-types";
import CreateDetalleRetiroDto from "./create-detalle_retiro.dto";


class UpdateDetalleRetiroDto extends PartialType(CreateDetalleRetiroDto)
{
    
}
export default UpdateDetalleRetiroDto;