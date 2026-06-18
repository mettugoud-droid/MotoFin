import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status ok', () => {
      const result = controller.getHealth();

      expect(result.status).toBe('ok');
      expect(result.service).toBe('MotoFin API');
      expect(result.version).toBe('1.0.0');
      expect(result.timestamp).toBeDefined();
      expect(typeof result.uptime).toBe('number');
      expect(result.environment).toBeDefined();
    });

    it('should return valid ISO timestamp', () => {
      const result = controller.getHealth();
      const parsed = new Date(result.timestamp);

      expect(parsed.toISOString()).toBe(result.timestamp);
    });

    it('should return positive uptime', () => {
      const result = controller.getHealth();

      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });
  });
});
