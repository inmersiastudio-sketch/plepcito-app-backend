import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPlan(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('A PDF file is required');
    return this.plansService.handleUpload(file);
  }

  @Get('status/:id')
  async getStatus(@Param('id') id: string) {
    return this.plansService.getStatus(id);
  }

  @Post(':id/validate')
  async validatePlan(@Param('id') id: string, @Body() dto: any) {
    return this.plansService.validateAndPersist(id, dto);
  }
}
