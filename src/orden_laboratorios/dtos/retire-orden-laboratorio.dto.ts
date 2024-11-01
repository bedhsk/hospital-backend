import { IsUUID, IsNotEmpty } from "class-validator";

export default class RetireOrdenDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}