import { Controller, Get, Header } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { subDays, format } from "date-fns";
import { Builder } from "xml2js";
import { ProductService } from "../product/product.service";

@Controller("sitemap")
export class SitemapController {
  domain: string;

  constructor(
    private readonly testService: ProductService,
    private readonly configService: ConfigService,
  ) {
    this.domain = this.configService.get("DOMAIN") ?? "";
  }

  @Get("xml")
  @Header("content-type", "text/xml")
  sitemap() {
    const formatString = 'yyyy-MM-dd"T"HH:mm:00.000xxx';

    const res = [
      {
        loc: `${this.domain}/tests`,
        lastmod: format(subDays(new Date(), 1), formatString),
        changefreq: "daily",
        priority: "1.0",
      },
    ];

    const builder = new Builder({
      xmldec: { version: "1.0", encoding: "UTF-8" },
    });

    return builder.buildObject({
      urlset: {
        $: { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" },
        url: res,
      },
    });
  }
}
