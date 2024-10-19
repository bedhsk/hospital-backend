import { IsUUID, IsNumber, IsNotEmpty, } from 'class-validator';
  
 class CreateDetalleRetiroDto {
    @IsUUID()
    @IsNotEmpty()
    retiroId: string;
  
    @IsUUID()
    @IsNotEmpty()
    insumoDepartamentoId: string;

    @IsNumber()
    @IsNotEmpty()
    cantidad: number;
  }
  export default CreateDetalleRetiroDto;