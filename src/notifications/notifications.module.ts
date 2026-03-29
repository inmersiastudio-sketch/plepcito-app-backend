import { Module, Global } from '@nestjs/common';
import { INotificationService } from './notification.service.interface';
import { MockNotificationService } from './mock-notification.service';
// import { FcmNotificationService } from './fcm-notification.service';

@Global()
@Module({
  providers: [
    {
      provide: INotificationService,
      useClass: MockNotificationService, // Swap to FcmNotificationService when ready
    }
  ],
  exports: [INotificationService]
})
export class NotificationsModule {}
