import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ProductModule } from "./product/product.module";
import { FilesModule } from "./files/files.module";
// import { SitemapModule } from "./sitemap/sitemap.module";
import { TelegramModule } from "./telegram/telegram.module";
import { getMongoConfig } from "./configs/mongo.config";
import { getTelegramConfig } from "./configs/telegram.config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMongoConfig,
      inject: [ConfigService],
    }),

    AuthModule,
    ProductModule,
    FilesModule,
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTelegramConfig,
    }),
    // SitemapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
