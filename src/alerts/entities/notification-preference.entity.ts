import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Student } from '../../auth/entities/student.entity';

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ default: true })
  morning_digest_enabled: boolean;

  @Column({ type: 'time', default: '08:00' })
  morning_digest_time: string;

  @Column({ default: true })
  urgent_alerts_enabled: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  mute_until: Date;

  @Column({ type: 'jsonb', default: { exam_reminder_hours: [72, 24, 12], risk_warning_threshold: 60, digest_max_per_subject: 1 } })
  alert_config_json: any;

  @Column({ type: 'jsonb', default: [] })
  per_subject_rules_json: any;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
