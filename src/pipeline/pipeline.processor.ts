import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadedDocument } from '../plans/entities/uploaded-document.entity';
import { IStorageService } from '../storage/storage.interface';
import { ConfigService } from '@nestjs/config';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import OpenAI from 'openai';
import { PLAN_EXTRACTION_PROMPT } from './prompts/plan-extraction';

@Processor('pdf-pipeline')
export class PipelineProcessor {
  private visionClient: ImageAnnotatorClient;
  private openai: OpenAI;

  constructor(
    @InjectRepository(UploadedDocument)
    private documentRepo: Repository<UploadedDocument>,
    private storageService: IStorageService,
    private configService: ConfigService,
  ) {
    this.visionClient = new ImageAnnotatorClient(); // Assumes GOOGLE_APPLICATION_CREDENTIALS in env
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  @Process('process-pdf')
  async handlePdf(job: Job<{ documentId: string; filePath: string }>) {
    const { documentId, filePath } = job.data;

    await this.updateStatus(documentId, 'processing', 'pending');

    let rawText: string;
    try {
      rawText = await this.runOcr(filePath);
      await this.updateStatus(documentId, 'completed', 'processing');
    } catch (ocrError) {
      await this.updateStatus(documentId, 'failed', 'pending');
      throw ocrError;
    }

    try {
      const extracted = await this.runLlm(rawText);
      await this.documentRepo.update(documentId, {
        llm_status: 'completed',
        extracted_json: extracted,
      });
    } catch (llmError) {
      await this.updateStatus(documentId, 'completed', 'failed');
    }
  }

  private async updateStatus(id: string, ocr: string, llm: string) {
    await this.documentRepo.update(id, { ocr_status: ocr, llm_status: llm });
  }

  private async runOcr(filePath: string): Promise<string> {
    const fileBuffer = await this.storageService.getFileBuffer(filePath);
    
    const [result] = await this.visionClient.documentTextDetection({
      image: { content: fileBuffer.toString('base64') },
    });

    return result.fullTextAnnotation?.text ?? '';
  }

  private async runLlm(rawText: string): Promise<any> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: PLAN_EXTRACTION_PROMPT },
        { role: 'user', content: rawText }
      ],
      temperature: 0,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No content returned from LLM');
    
    return JSON.parse(content);
  }
}
