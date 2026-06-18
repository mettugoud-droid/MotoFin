import { HealthService } from './health.service';
import { HealthResponseDto } from './dto/health-response.dto';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getHealth(): HealthResponseDto;
}
//# sourceMappingURL=health.controller.d.ts.map