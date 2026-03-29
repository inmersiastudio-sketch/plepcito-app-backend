import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PlanSubject } from '../../plans/entities/plan-subject.entity';
import { AcademicPeriod } from './academic-period.entity';

@Entity('course_offerings')
export class CourseOffering {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PlanSubject)
  @JoinColumn({ name: 'plan_subject_id' })
  planSubject: PlanSubject;

  @ManyToOne(() => AcademicPeriod)
  @JoinColumn({ name: 'academic_period_id' })
  academicPeriod: AcademicPeriod;

  @Column({ nullable: true })
  commission: string;

  @Column({ nullable: true })
  teacher_name: string;

  @Column({ nullable: true })
  classroom: string;

  @Column({ type: 'jsonb', nullable: true })
  schedule_json: any;

  @Column({ nullable: true })
  max_capacity: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
