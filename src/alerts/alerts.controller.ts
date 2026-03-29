import { Controller, Get, Put, Param, Request, Body, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async getAlerts(@Request() req: any) {
    return this.alertsService.getPendingAlerts(req.user.userId);
  }

  @Put('read-all')
  async markAllAsRead(@Request() req: any) {
    return this.alertsService.markAllAsRead(req.user.userId);
  }

  @Put('preferences')
  async updatePreferences(@Request() req: any, @Body() body: any) {
    return this.alertsService.updatePreferences(req.user.userId, body);
  }

  @Put(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    return this.alertsService.markAsRead(req.user.userId, id);
  }
}
