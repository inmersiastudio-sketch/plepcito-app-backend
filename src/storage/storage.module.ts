import { Module, Global } from '@nestjs/common';
import { IStorageService } from './storage.interface';
import { LocalStorageService } from './local-storage.service';

@Global()
@Module({
  providers: [
    {
      provide: IStorageService,
      useClass: LocalStorageService,
    },
  ],
  exports: [IStorageService],
})
export class StorageModule {}
