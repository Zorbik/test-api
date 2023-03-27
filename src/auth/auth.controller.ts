import {
  Controller,
  Body,
  HttpCode,
  Post,
  Param,
  // Get,
  Delete,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { TelegramService } from "../telegram/telegram.service";
import { IdValidationPipe } from "../pipes/id-validation.pipe";
import { ALREADY_REGISTERED_ERROR } from "./auth.constans";
import { CreateUserDto } from "./dto/create-user.dto";
import { SignInDto } from "./dto/signin.dto";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { UsersService } from "./users.service";
import { Statistic } from "./dto/results.dto";

@Controller("users")
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly telegramService: TelegramService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post("signup")
  async create(@Body() dto: CreateUserDto) {
    const isUser = await this.userService.findUser(dto.email);

    if (isUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }

    const message = `User ${dto.name} with e-mail: ${dto.email} registered`;
    const user = await this.userService.createUser(dto);
    await this.telegramService.sendMessage(message);

    return user;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login")
  async signIn(@Body() { email, password }: SignInDto) {
    const validEmail = await this.userService.validateUser(email, password);

    return await this.userService.signinUser(validEmail);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: Statistic) {
    const user = await this.userService.updateUser(id, dto);

    const message = `User ${user?.name} with e-mail: ${
      user?.email
    } pass exam in category: ${dto.category} with success: ${Math.round(
      (dto.correct * 100) / (dto.correct + dto.incorrect),
    )} %`;

    await this.telegramService.sendMessage(message);

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id", IdValidationPipe) id: string) {
    await this.userService.deleteUser(id);
  }
}
