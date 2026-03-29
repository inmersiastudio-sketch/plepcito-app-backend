import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { addHours, differenceInHours, format } from 'date-fns';
import { Alert } from './entities/alert.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { Evaluation } from '../academic/entities/evaluation.entity';
import { Enrollment } from '../academic/entities/enrollment.entity';
import { INotificationService } from '../notifications/notification.service.interface';

@Injectable()
export class AlertsRulesService {
  private readonly logger = new Logger(AlertsRulesService.name);

  constructor(
    @InjectRepository(Alert) private alertRepo: Repository<Alert>,
    @InjectRepository(Evaluation) private evaluationRepo: Repository<Evaluation>,
    @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(NotificationPreference) private prefRepo: Repository<NotificationPreference>,
    private readonly notificationService: INotificationService
  ) {}

  async computeAlertsForStudent(studentId: string): Promise<void> {
    const prefs = await this.prefRepo.findOne({ where: { student: { id: studentId } } });
    const threshold = prefs?.alert_config_json?.risk_warning_threshold ?? 60;
    
    // Regla 1: exámenes próximos (72h y 24h)
    const upcomingExams = await this.evaluationRepo.find({
      where: {
        enrollment: { student: { id: studentId } },
        status: 'scheduled',
        scheduled_at: Between(new Date(), addHours(new Date(), 72)),
      },
      relations: ['enrollment', 'enrollment.courseOffering', 'enrollment.courseOffering.planSubject'],
    });

    for (const exam of upcomingExams) {
      const hoursLeft = differenceInHours(exam.scheduled_at, new Date());
      let priority = 'medium';
      let titleMark = 72;
      
      if (hoursLeft <= 24) { priority = 'urgent'; titleMark = 24; }
      else if (hoursLeft <= 72) { priority = 'high'; titleMark = 72; }

      const subjectName = exam.enrollment?.courseOffering?.planSubject?.name || 'Materia';
      
      const existing = await this.alertRepo.findOne({
        where: {
          student: { id: studentId },
          alert_type: 'exam_reminder',
          title: `${exam.title || 'Examen'} en ${titleMark}h`
        }
      });

      if (!existing) {
        const newAlert = this.alertRepo.create({
          student: { id: studentId },
          planSubject: exam.enrollment?.courseOffering?.planSubject,
          alert_type: 'exam_reminder',
          priority,
          title: `${exam.title || 'Examen'} en ${titleMark}h`,
          message: `Tenés "${exam.title}" de ${subjectName} programado para el ${format(exam.scheduled_at, 'dd/MM HH:mm')}.`,
          scheduled_for: new Date(),
        });
        await this.alertRepo.save(newAlert);
        await this.notificationService.send(studentId, { title: newAlert.title, body: newAlert.message });
      }
    }

    // Regla 2: Riesgo de cursada
    const riskyEnrollments = await this.enrollmentRepo.find({
      where: {
        student: { id: studentId },
        enrollment_status: 'active',
        risk_score: MoreThan(threshold),
      },
      relations: ['courseOffering', 'courseOffering.planSubject']
    });

    for (const enrollment of riskyEnrollments) {
      const subjectName = enrollment.courseOffering?.planSubject?.name || 'Materia';
      const existing = await this.alertRepo.findOne({
        where: {
          student: { id: studentId },
          alert_type: 'risk_warning',
          planSubject: { id: enrollment.courseOffering?.planSubject?.id }
        },
        order: { created_at: 'DESC' }
      });

      // Avoid spamming this rule
      const isRecent = existing && differenceInHours(new Date(), existing.created_at) < 24 * 7;
      
      if (!isRecent) {
        const newAlert = this.alertRepo.create({
          student: { id: studentId },
          planSubject: enrollment.courseOffering?.planSubject,
          alert_type: 'risk_warning',
          priority: 'high',
          title: `Riesgo académico en ${subjectName}`,
          message: `Tu índice de riesgo en ${subjectName} supera el límite. Recomendamos ajustar tus horas de estudio.`,
          scheduled_for: new Date()
        });
        await this.alertRepo.save(newAlert);
      }
    }
  }
}
