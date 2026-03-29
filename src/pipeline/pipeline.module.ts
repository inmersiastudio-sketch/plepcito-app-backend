import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PipelineProcessor } from './pipeline.processor';
import { UploadedDocument } from '../plans/entities/uploaded-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadedDocument]),
    ConfigModule,
  ],
  providers: [PipelineProcessor],
})
export class PipelineModule {}
