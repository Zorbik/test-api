import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateTestDto } from "./dto/create-test.dto";
import { Product, ProductDocument } from "./product.model/product.model";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(dto: CreateTestDto): Promise<Product> {
    return await this.productModel.create(dto);
  }

  async getTest(category: string): Promise<Product[]> {
    return await this.productModel
      .aggregate([{ $match: { category } }, { $sample: { size: 12 } }])
      .exec();
  }

  async search(query: string): Promise<Product[]> {
    return await this.productModel
      .find({
        $text: { $search: query, $caseSensitive: false },
      })
      .exec();
  }

  async delete(id: string): Promise<string | null> {
    return await this.productModel.findByIdAndDelete(id);
  }

  async updateById(id: string, dto: CreateTestDto): Promise<Product | null> {
    return await this.productModel.findByIdAndUpdate(id, dto, { new: true });
  }
}
