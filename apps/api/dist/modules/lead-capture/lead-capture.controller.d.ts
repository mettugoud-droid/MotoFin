import { LeadCaptureService } from './lead-capture.service';
import { CaptureLeadDto } from './dto/capture-lead.dto';
import { CaptureLeadResponseDto } from './dto/capture-lead-response.dto';
export declare class LeadCaptureController {
    private readonly leadCaptureService;
    constructor(leadCaptureService: LeadCaptureService);
    captureLead(dto: CaptureLeadDto): Promise<CaptureLeadResponseDto>;
}
//# sourceMappingURL=lead-capture.controller.d.ts.map