import { Injectable, Logger } from '@nestjs/common';
import { INotificationService, PushPayload } from './notification.service.interface';

@Injectable()
export class MockNotificationService implements INotificationService {
  private readonly logger = new Logger('MockNotificationService');

  async send(studentId: string, payload: PushPayload): Promise<void> {
    this.logger.debug(
      `[MOCK PUSH] → Student: ${studentId} | Title: ${payload.title} | Body: ${payload.body}`
    );
  }
}
