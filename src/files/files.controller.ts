import {
  Controller,
  Post,
  HttpCode,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { FileResponse } from "./dto/file.response";
import { Mfile } from "./dto/mfile.class";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("files"))
  async uploadFiles(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponse[]> {
    const filesArray: Mfile[] = [new Mfile(file)];

    if (file.mimetype.includes("image")) {
      const buffer = await this.filesService.converToWebp(file.buffer);
      filesArray.push(
        new Mfile({
          originalname: `${file.originalname.split(".")[0]}.webp`,
          buffer,
        }),
      );
    }

    return await this.filesService.saveFiles(filesArray);
  }
}
