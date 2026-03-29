import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, IsNull } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { NotificationPreference } from './entities/notification-preference.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertRepo: Repository<Alert>,
    @InjectRepository(NotificationPreference)
    private prefRepo: Repository<NotificationPreference>,
  ) {}

  async getPendingAlerts(studentId: string) {
    const alerts = await this.alertRepo.find({
      where: {
        student: { id: studentId },
        scheduled_for: LessThanOrEqual(new Date()),
      },
      order: { scheduled_for: 'DESC' },
    });
    
    const unsent = alerts.filter(a => !a.sent_at);
    if (unsent.length > 0) {
      const now = new Date();
      await this.alertRepo.update(
        unsent.map(a => a.id),
        { sent_at: now }
      );
      unsent.forEach(a => a.sent_at = now);
    }
    
    return alerts;
  }

  async markAsRead(studentId: string, alertId: string) {
    const result = await this.alertRepo.update(
      { id: alertId, student: { id: studentId } },
      { read_at: new Date() }
    );
    if (result.affected === 0) throw new NotFoundException('Alert not found');
    return { success: true };
  }

  async markAllAsRead(studentId: string) {
    await this.alertRepo.update(
      { student: { id: studentId }, read_at: IsNull() },
      { read_at: new Date() }
    );
    return { success: true };
  }

  async updatePreferences(studentId: string, prefs: Partial<NotificationPreference>) {
    let existing = await this.prefRepo.findOne({ where: { student: { id: studentId } }});
    if (!existing) {
      existing = this.prefRepo.create({ student: { id: studentId }, ...prefs });
    } else {
      Object.assign(existing, prefs);
    }
    return this.prefRepo.save(existing);
  }
}
