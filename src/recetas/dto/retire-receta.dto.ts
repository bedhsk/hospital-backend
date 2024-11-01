import { IsUUID, IsNotEmpty } from "class-validator";

export default class RetireRecetaDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}