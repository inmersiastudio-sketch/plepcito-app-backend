export const INotificationService = Symbol('INotificationService');

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface INotificationService {
  send(studentId: string, payload: PushPayload): Promise<void>;
}
