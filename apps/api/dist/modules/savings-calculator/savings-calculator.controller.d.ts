import { SavingsCalculatorService } from './savings-calculator.service';
import { CalculateSavingsDto } from './dto/calculate-savings.dto';
import { SavingsCalculationResponseDto } from './dto/savings-response.dto';
export declare class SavingsCalculatorController {
    private readonly savingsCalculatorService;
    constructor(savingsCalculatorService: SavingsCalculatorService);
    calculateSavings(dto: CalculateSavingsDto): Promise<SavingsCalculationResponseDto>;
}
//# sourceMappingURL=savings-calculator.controller.d.ts.map