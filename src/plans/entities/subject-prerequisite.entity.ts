import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('subject_prerequisites')
export class SubjectPrerequisite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  plan_subject_id: string;

  @Column({ type: 'uuid', nullable: true })
  required_plan_subject_id: string;

  @Column({ default: 'approved' })
  requirement_type: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  needs_manual_review: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
