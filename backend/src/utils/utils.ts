import { randomBytes } from 'crypto';
import path from 'path';
import fs from 'fs-extra';

/**
 * Write image file to the path from base64
 * @param base64 base64 file data
 * @param dirPath
 * @returns file path with the randomly generated file name
 */
export const base64ImageWriter = async (
  base64: string,
  dirPath: string,
): Promise<string> => {
  console.log(path);
  const fileExt = /data:image\/(.+?);base64,/.exec(base64)?.[1];
  if (!fileExt) throw new Error('Invalid file type');
  const base64Data = base64.replace(/data:image\/(.+?);base64,/, '');
  const dataBuffer = Buffer.from(base64Data, 'base64');
  const filePath = path.join(
    dirPath,
    `${randomBytes(10).toString('hex')}.${fileExt}`,
  );
  await fs.ensureDir(dirPath);
  await fs.writeFile(filePath, dataBuffer);
  return filePath;
};
