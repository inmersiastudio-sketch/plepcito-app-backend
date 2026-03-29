import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../auth/entities/student.entity';
import { PlanSubject } from '../../plans/entities/plan-subject.entity';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => PlanSubject, { nullable: true })
  @JoinColumn({ name: 'plan_subject_id' })
  planSubject: PlanSubject;

  @Column()
  alert_type: string;

  @Column({ default: 'medium' })
  priority: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  payload_json: any;

  @Column({ type: 'timestamptz' })
  scheduled_for: Date;

  @Column({ type: 'timestamptz', nullable: true })
  sent_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  read_at: Date;

  @Column({ nullable: true })
  action_taken: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
