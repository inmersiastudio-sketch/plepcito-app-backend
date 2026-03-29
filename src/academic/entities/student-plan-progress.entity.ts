import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../auth/entities/student.entity';
import { PlanSubject } from '../../plans/entities/plan-subject.entity';
import { AcademicPeriod } from './academic-period.entity';

@Entity('student_plan_progress')
export class StudentPlanProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => PlanSubject)
  @JoinColumn({ name: 'plan_subject_id' })
  planSubject: PlanSubject;

  @Column({ default: 'blocked' })
  status: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  final_grade: number;

  @Column({ type: 'date', nullable: true })
  approved_at: string;

  @ManyToOne(() => AcademicPeriod, { nullable: true })
  @JoinColumn({ name: 'last_attempt_period_id' })
  lastAttemptPeriod: AcademicPeriod;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
