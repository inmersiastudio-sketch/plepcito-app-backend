import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('plan_subjects')
export class PlanSubject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  study_plan_id: string;

  @Column({ type: 'uuid', nullable: true })
  subject_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column()
  year_number: number;

  @Column()
  term: string;

  @Column({ default: true })
  is_mandatory: boolean;

  @Column({ nullable: true })
  credit_hours: number;

  @Column({ default: 0 })
  criticality_score: number;

  @Column({ default: false })
  is_historical_bottleneck: boolean;

  @Column({ type: 'text', nullable: true })
  raw_text_from_pdf: string;

  @Column({ default: false })
  needs_manual_review: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
