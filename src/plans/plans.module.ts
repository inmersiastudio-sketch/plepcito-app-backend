import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { UploadedDocument } from './entities/uploaded-document.entity';
import { StudyPlan } from './entities/study-plan.entity';
import { PlanSubject } from './entities/plan-subject.entity';
import { SubjectPrerequisite } from './entities/subject-prerequisite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadedDocument, StudyPlan, PlanSubject, SubjectPrerequisite]),
    BullModule.registerQueue({
      name: 'pdf-pipeline',
    }),
  ],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
