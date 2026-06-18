"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const health_controller_1 = require("./health.controller");
const health_service_1 = require("./health.service");
describe('HealthController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [health_controller_1.HealthController],
            providers: [health_service_1.HealthService],
        }).compile();
        controller = module.get(health_controller_1.HealthController);
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
//# sourceMappingURL=health.controller.spec.js.map