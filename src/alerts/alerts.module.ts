import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AlertsRulesService } from './alerts-rules.service';
import { AlertsCronService } from './alerts-cron.service';
import { Alert } from './entities/alert.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { Evaluation } from '../academic/entities/evaluation.entity';
import { Enrollment } from '../academic/entities/enrollment.entity';
import { Student } from '../auth/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Alert, 
      NotificationPreference, 
      Evaluation, 
      Enrollment,
      Student
    ])
  ],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsRulesService, AlertsCronService]
})
export class AlertsModule {}
