import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs-extra';
import { randomBytes } from 'crypto';

@Injectable()
export class UtilsService {
  constructor(private configService: ConfigService) {}

  private publicDirPath = this.configService.getOrThrow<string>(
    'PUBLIC_DIR_ABSOLUTE_PATH',
  );

  private URLToPublicDir = '/public';

  /**
   * Write image file to the public path from base64
   * @param base64Image base64 file data
   * @returns the written file path with the randomly generated file name
   */
  async writeBase64ImageToFile(base64Image: string): Promise<string> {
    const fileExt = /data:image\/(.+?);base64,/.exec(base64Image)?.[1];
    if (!fileExt) throw new Error('Invalid file type');
    const base64Data = base64Image.replace(/data:image\/(.+?);base64,/, '');
    const dataBuffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join(
      this.publicDirPath,
      `${randomBytes(10).toString('hex')}.${fileExt}`,
    );
    await fs.ensureDir(this.publicDirPath);
    await fs.writeFile(filePath, dataBuffer);
    return filePath;
  }

  filePathToURL(filePath: string): string {
    return filePath.replace(this.publicDirPath, this.URLToPublicDir);
  }
}
