import { IsString, Length, IsEmail } from "class-validator";
import { Statistic } from "./results.dto";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @Length(3, 30)
  @IsString()
  name: string;

  @Length(7, 30)
  @IsString()
  password: string;

  statistics: Statistic[];
}
