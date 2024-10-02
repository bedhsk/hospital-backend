import { IsUUID, IsNumber, } from 'class-validator';
  
 class CreateDetalleRetiroDto {
    @IsUUID()
    retiroId: string;
  
    @IsUUID()
    insumoDepartamentoId: string;

    @IsNumber()
    cantidad: number;
  }
  export default CreateDetalleRetiroDto;