import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../auth/entities/student.entity';
import { CourseOffering } from './course-offering.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => CourseOffering)
  @JoinColumn({ name: 'course_offering_id' })
  courseOffering: CourseOffering;

  @Column({ default: 'active' })
  enrollment_status: string;

  @Column({ default: 'en_curso' })
  current_condition: string; 

  @Column({ nullable: true })
  projected_condition: string;

  @Column({ default: 0 })
  risk_score: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  enrolled_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completed_at: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
