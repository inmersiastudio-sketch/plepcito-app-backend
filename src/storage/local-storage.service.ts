import { Injectable } from '@nestjs/common';
import { IStorageService } from './storage.interface';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (e) {}
  }

  async save(file: Express.Multer.File): Promise<string> {
    await this.ensureUploadDir();
    const filename = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, filename);
    await fs.writeFile(filePath, file.buffer);
    return filePath;
  }

  async getFileBuffer(url: string): Promise<Buffer> {
    return fs.readFile(url);
  }
}
