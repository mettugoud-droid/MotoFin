import { PrismaService } from '../../prisma/prisma.service';
export interface BankRateInfo {
    bankId: string;
    bankName: string;
    bankCode: string;
    interestRateMin: number;
    interestRateMax: number;
    minLoanAmount: number | null;
    maxLoanAmount: number | null;
    historicalApprovalRate: number;
}
export declare class BankRatesService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getActiveRefinanceRates(loanAmount?: number): Promise<BankRateInfo[]>;
}
//# sourceMappingURL=bank-rates.service.d.ts.map