import { Test, TestingModule } from '@nestjs/testing';
import { AlertsRulesService } from './alerts-rules.service';

describe('AlertsRulesService', () => {
  let service: AlertsRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertsRulesService],
    }).compile();

    service = module.get<AlertsRulesService>(AlertsRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
