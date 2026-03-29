import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password_hash: string;

  @Column({ nullable: true })
  google_id: string;

  @Column()
  full_name: string;

  @Column({ type: 'uuid', nullable: true })
  institution_id: string;
  
  @Column({ type: 'int', nullable: true })
  work_hours_week: number;
  
  @Column({ type: 'int', nullable: true })
  study_hours_week: number;
  
  @Column({ nullable: true })
  uses_weekends: boolean;
  
  @Column({ nullable: true })
  career_goal: string;
  
  @Column({ nullable: true })
  career_horizon: string;

  @Column({ default: false })
  onboarding_completed: boolean;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  last_login_at: Date;
}
