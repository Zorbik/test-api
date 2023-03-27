import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { TelegramModule } from "../telegram/telegram.module";
import { getJWTConfig } from "../configs/jwt.config";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { User, UserSchema } from "./user.model/user.model";
import { UsersService } from "./users.service";

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    PassportModule,
    TelegramModule,
  ],

  providers: [UsersService, JwtStrategy],
})
export class AuthModule {}
