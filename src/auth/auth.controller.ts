import {
  Controller,
  Body,
  HttpCode,
  Post,
  // Param,
  // Get,
  // Delete,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  // UseGuards,
} from "@nestjs/common";
import { ALREADY_REGISTERED_ERROR } from "./auth.constans";
import { CreateUserDto } from "./dto/create-user.dto";
import { SignInDto } from "./dto/signin.dto";
// import { JwtAuthGuard } from "./guards/jwt.guard";
import { UsersService } from "./users.service";

@Controller("users")
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @Post("signup")
  async create(@Body() dto: CreateUserDto) {
    const isUser = await this.userService.findUser(dto.email);

    if (isUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }

    return await this.userService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login")
  async signIn(@Body() { email, password }: SignInDto) {
    const validEmail = await this.userService.validateUser(email, password);

    return await this.userService.signinUser(validEmail);
  }

  // @UseGuards(JwtAuthGuard)
  // @Delete(":id")
  // async delete(@Param("id", IdValidationPipe) id: string) {
  //   await this.userService.deleteUser(id);
  // }
}
