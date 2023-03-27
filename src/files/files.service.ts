import { Injectable } from "@nestjs/common";
import { path } from "app-root-path";
import { format } from "date-fns";
import { ensureDir, writeFile } from "fs-extra";
import * as sharp from "sharp";
import { FileResponse } from "./dto/file.response";
import { Mfile } from "./dto/mfile.class";

@Injectable()
export class FilesService {
  async saveFiles(files: Mfile[]): Promise<FileResponse[]> {
    const dateFolder = format(new Date(), "yyyy-MM-dd");
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    await ensureDir(uploadFolder);

    const responsePromises = files.map((item) => {
      const file = `${item.originalname}`;

      writeFile(`${uploadFolder}/${file}`, item.buffer);
      return {
        url: `${dateFolder}/${file}`,
        name: `${file}`,
      };
    });
    const response = await Promise.all(responsePromises);

    return response;
  }

  converToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
