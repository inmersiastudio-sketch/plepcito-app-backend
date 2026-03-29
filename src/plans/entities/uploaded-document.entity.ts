import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('uploaded_documents')
export class UploadedDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  student_id: string;

  @Column({ type: 'uuid', nullable: true })
  study_plan_id: string;

  @Column()
  original_filename: string;

  @Column()
  file_url: string;

  @Column({ nullable: true })
  file_size_bytes: number;

  @Column({ default: 'pending' })
  ocr_status: string;

  @Column({ default: 'pending' })
  llm_status: string;

  @Column({ default: 'pending' })
  validation_status: string;

  @Column({ type: 'jsonb', nullable: true })
  extracted_json: any;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ocr_confidence: number;

  @Column({ type: 'text', array: true, nullable: true })
  processing_errors: string[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
