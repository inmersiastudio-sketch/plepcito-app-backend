import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Express } from 'express';
import { IStorageService } from '../storage/storage.interface';
import { UploadedDocument } from './entities/uploaded-document.entity';
import { StudyPlan } from './entities/study-plan.entity';
import { PlanSubject } from './entities/plan-subject.entity';
import { SubjectPrerequisite } from './entities/subject-prerequisite.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(UploadedDocument)
    private documentRepo: Repository<UploadedDocument>,
    @InjectQueue('pdf-pipeline') private pipelineQueue: Queue,
    private storageService: IStorageService,
    private dataSource: DataSource,
  ) {}

  async handleUpload(file: Express.Multer.File) {
    const fileUrl = await this.storageService.save(file);

    const doc = this.documentRepo.create({
      original_filename: file.originalname,
      file_url: fileUrl,
      file_size_bytes: file.size,
      ocr_status: 'pending',
      llm_status: 'pending',
    });
    
    await this.documentRepo.save(doc);

    await this.pipelineQueue.add('process-pdf', {
      documentId: doc.id,
      filePath: fileUrl,
    });

    return doc;
  }

  async getStatus(id: string) {
    const doc = await this.documentRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    return {
      ocr_status: doc.ocr_status,
      llm_status: doc.llm_status,
      validation_status: doc.validation_status,
      extracted_json: doc.extracted_json,
      errors: doc.processing_errors,
    };
  }

  async validateAndPersist(documentId: string, dto: any) {
    const doc = await this.documentRepo.findOne({ where: { id: documentId } });
    if (!doc) throw new NotFoundException('Document not found');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const plan = queryRunner.manager.create(StudyPlan, {
        plan_name: dto.career_name || 'Unknown',
        plan_version: dto.plan_version,
        source_pdf_url: doc.file_url,
        status: 'validated',
      });
      await queryRunner.manager.save(plan);

      const codeToSubjectMap = new Map<string, string>();
      
      if (dto.subjects && Array.isArray(dto.subjects)) {
        for (const subDto of dto.subjects) {
          const subject = queryRunner.manager.create(PlanSubject, {
            study_plan_id: plan.id,
            name: subDto.name,
            code: subDto.code,
            year_number: subDto.year_number,
            term: subDto.term,
            is_mandatory: subDto.is_mandatory ?? true,
            needs_manual_review: subDto.ambiguous ?? false,
          });
          await queryRunner.manager.save(subject);
          
          if (subDto.code) {
             codeToSubjectMap.set(subDto.code, subject.id);
          }
        }

        for (const subDto of dto.subjects) {
          if (!subDto.prerequisites || !Array.isArray(subDto.prerequisites)) continue;
          const currentSubjectId = codeToSubjectMap.get(subDto.code);
          if (!currentSubjectId) continue;

          for (const preqDto of subDto.prerequisites) {
             const requiredId = codeToSubjectMap.get(preqDto.code);
             const reqEntity = queryRunner.manager.create(SubjectPrerequisite, {
               plan_subject_id: currentSubjectId,
               required_plan_subject_id: requiredId || undefined,
               requirement_type: preqDto.type || 'approved',
               needs_manual_review: !requiredId,
             });
             await queryRunner.manager.save(reqEntity);
          }
        }
      }

      doc.validation_status = 'confirmed';
      await queryRunner.manager.save(doc);

      await queryRunner.commitTransaction();
      return plan;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
