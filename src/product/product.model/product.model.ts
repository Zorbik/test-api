import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ required: [true, "Section is required"] })
  category: "theory" | "technical";

  @Prop({ required: true })
  question: string;

  @Prop({ required: true, type: () => [String] })
  answers: string[];

  @Prop({ required: true })
  rightAnswer: string;
}

const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index(
  {
    question: "text",
    answers: "text",
  },
  {
    default_language: "english",
    weights: {
      question: 10,
      answers: 5,
    },
  },
);

export { ProductSchema };
