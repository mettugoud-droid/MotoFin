import { EmiCalculatorService } from '../shared/services/emi-calculator.service';
import { BankRatesService } from '../shared/services/bank-rates.service';
import { VehicleValuationService } from '../shared/services/vehicle-valuation.service';
import { SavingsCalculationRepository } from './repositories/savings-calculation.repository';
import { CalculateSavingsDto } from './dto/calculate-savings.dto';
import { SavingsCalculationDataDto } from './dto/savings-response.dto';
export interface SavingsCalculationResult {
    data: SavingsCalculationDataDto;
    calculationId: string;
    responseTimeMs: number;
}
export declare class SavingsCalculatorService {
    private readonly emiCalculator;
    private readonly bankRatesService;
    private readonly vehicleValuation;
    private readonly repository;
    private readonly logger;
    constructor(emiCalculator: EmiCalculatorService, bankRatesService: BankRatesService, vehicleValuation: VehicleValuationService, repository: SavingsCalculationRepository);
    calculateSavings(dto: CalculateSavingsDto): Promise<SavingsCalculationResult>;
}
//# sourceMappingURL=savings-calculator.service.d.ts.map