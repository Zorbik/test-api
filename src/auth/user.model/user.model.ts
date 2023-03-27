import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Statistic } from "../dto/results.dto";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: [true, "Email is required"], unique: true })
  email: string;

  @Prop({ required: [true, "Name is required"] })
  name: string;

  @Prop({ required: [true, "Password is required"] })
  password: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  statistics: Statistic[];
}

export const UserSchema = SchemaFactory.createForClass(User);
