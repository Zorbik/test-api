import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProductService } from "../product/product.service";
import { SitemapController } from "./sitemap.controller";

@Module({
  controllers: [SitemapController],
  imports: [ProductService, ConfigModule],
})
export class SitemapModule {}
