import { Express } from 'express';

export const IStorageService = Symbol('IStorageService');

export interface IStorageService {
  save(file: Express.Multer.File): Promise<string>;
  getFileBuffer(url: string): Promise<Buffer>;
}
