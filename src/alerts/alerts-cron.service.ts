import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../auth/entities/student.entity';
import { AlertsRulesService } from './alerts-rules.service';

@Injectable()
export class AlertsCronService {
  private readonly logger = new Logger(AlertsCronService.name);

  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    private rulesService: AlertsRulesService
  ) {}

  @Cron('0 7 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async scheduleAlerts() {
    this.logger.log('Started Daily Alerts Rule Evaluation');
    const students = await this.studentRepo.find({ where: { active: true } });
    for (const student of students) {
      try {
        await this.rulesService.computeAlertsForStudent(student.id);
      } catch (err) {
        this.logger.error(`Error computing alerts for student ${student.id}: ${err.message}`);
      }
    }
    this.logger.log('Finished Daily Alerts Rule Evaluation');
  }
}
