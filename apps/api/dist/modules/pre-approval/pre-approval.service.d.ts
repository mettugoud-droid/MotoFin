import { SavingsCalculationRepository } from '../savings-calculator/repositories/savings-calculation.repository';
import { BankRatesService } from '../shared/services/bank-rates.service';
import { VehicleValuationService } from '../shared/services/vehicle-valuation.service';
import { EmiCalculatorService } from '../shared/services/emi-calculator.service';
import { PreApprovalRepository } from './repositories/pre-approval.repository';
import { CalculatePreApprovalDto } from './dto/calculate-pre-approval.dto';
import { PreApprovalDataDto } from './dto/pre-approval-response.dto';
export interface PreApprovalResult {
    data: PreApprovalDataDto;
    preApprovalId: string;
    responseTimeMs: number;
}
export declare class PreApprovalService {
    private readonly savingsCalcRepository;
    private readonly bankRatesService;
    private readonly vehicleValuation;
    private readonly emiCalculator;
    private readonly preApprovalRepository;
    private readonly logger;
    constructor(savingsCalcRepository: SavingsCalculationRepository, bankRatesService: BankRatesService, vehicleValuation: VehicleValuationService, emiCalculator: EmiCalculatorService, preApprovalRepository: PreApprovalRepository);
    calculatePreApproval(dto: CalculatePreApprovalDto): Promise<PreApprovalResult>;
    private calculateApprovalProbability;
    private calculateRepaymentFactor;
    private getConfidenceLevel;
    private getConfidenceMessage;
    private getRecommendedBanks;
    private calculateTopUpAmount;
}
//# sourceMappingURL=pre-approval.service.d.ts.map