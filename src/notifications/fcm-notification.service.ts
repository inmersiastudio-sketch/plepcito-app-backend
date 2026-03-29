import { Injectable } from '@nestjs/common';
import { INotificationService, PushPayload } from './notification.service.interface';

@Injectable()
export class FcmNotificationService implements INotificationService {
  async send(studentId: string, payload: PushPayload): Promise<void> {
    // firebase-admin config goes here when keys are ready
  }
}
