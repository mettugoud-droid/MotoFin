import { PreApprovalService } from './pre-approval.service';
import { CalculatePreApprovalDto } from './dto/calculate-pre-approval.dto';
import { PreApprovalResponseDto } from './dto/pre-approval-response.dto';
export declare class PreApprovalController {
    private readonly preApprovalService;
    constructor(preApprovalService: PreApprovalService);
    calculatePreApproval(dto: CalculatePreApprovalDto): Promise<PreApprovalResponseDto>;
}
//# sourceMappingURL=pre-approval.controller.d.ts.map