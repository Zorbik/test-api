import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { genSalt, hash, compare } from "bcryptjs";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";

import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from "./auth.constans";
import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./user.model/user.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const createDate = new Date();
    const salt = await genSalt(10);

    const response = await this.userModel.create({
      ...dto,
      password: await hash(dto.password, salt),
      createdAt: createDate,
      updatedAt: createDate,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, password, ...user } = response.toObject();

    const token = await this.jwtService.signAsync({ email: dto.email });

    return { user, token };
  }

  async signinUser(email: string) {
    const user = await this.userModel
      .findOne({ email }, { password: 0, __v: 0 })
      .exec();

    const token = await this.jwtService.signAsync({ email });

    return { user, token };
  }

  async deleteUser(id: string) {
    await this.userModel.findByIdAndRemove({ _id: id }).exec();
  }

  async findUser(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return email;
  }
}
