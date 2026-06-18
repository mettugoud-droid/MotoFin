import { PrismaClient, LeadSourceType } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

async function main(): Promise<void> {
  console.log('🌱 Seeding MotoFin database...');

  // 1. Default Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'motofin' },
    update: {},
    create: {
      id: DEFAULT_TENANT_ID,
      name: 'MotoFin Technologies',
      slug: 'motofin',
      domain: 'motofin.in',
      settings: {
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        defaultCommissionRate: 0.01,
        referralLinkExpiryDays: 180,
        maxApplicationsPerLead: 3,
      },
      isActive: true,
    },
  });
  console.log(`  ✅ Tenant: ${tenant.name} (${tenant.id})`);

  // 2. Roles
  const roles = [
    { name: 'Admin', permissions: { all: true } },
    { name: 'Sales Manager', permissions: { leads: ['read', 'update', 'assign'], reports: ['read', 'export'] } },
    { name: 'Sales Executive', permissions: { leads: ['read', 'update'], interactions: ['create', 'read'] } },
    { name: 'Loan Processor', permissions: { applications: ['create', 'read', 'update'], documents: ['read', 'verify'] } },
    { name: 'Management', permissions: { dashboards: ['read'], reports: ['read', 'export'] } },
  ];

  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { uq_roles_tenant_name: { tenantId: DEFAULT_TENANT_ID, name: roleData.name } },
      update: { permissions: roleData.permissions },
      create: {
        tenantId: DEFAULT_TENANT_ID,
        name: roleData.name,
        permissions: roleData.permissions,
      },
    });
    console.log(`  ✅ Role: ${role.name}`);
  }

  // 3. Banks (9 partners)
  const banks = [
    { name: 'HDFC Bank', code: 'hdfc' },
    { name: 'ICICI Bank', code: 'icici' },
    { name: 'Axis Bank', code: 'axis' },
    { name: 'Kotak Mahindra Bank', code: 'kotak' },
    { name: 'IndusInd Bank', code: 'indusind' },
    { name: 'AU Small Finance Bank', code: 'au' },
    { name: 'Shriram Finance', code: 'shriram' },
    { name: 'Cholamandalam Finance', code: 'chola' },
    { name: 'Mahindra Finance', code: 'mahindra_finance' },
  ];

  for (const bankData of banks) {
    const bank = await prisma.bank.upsert({
      where: { uq_banks_tenant_code: { tenantId: DEFAULT_TENANT_ID, code: bankData.code } },
      update: {},
      create: {
        tenantId: DEFAULT_TENANT_ID,
        name: bankData.name,
        code: bankData.code,
        isActive: true,
        contactInfo: {},
      },
    });
    console.log(`  ✅ Bank: ${bank.name}`);
  }

  // 4. Bank Rules (Refinance product — interest_rate_min is the offered rate for calculator)
  const bankRateData = [
    { code: 'hdfc', rateMin: 8.50, rateMax: 11.50, minCredit: 725, maxAge: 84, minIncome: 30000, minLoan: 300000, maxLoan: 5000000, approval: 72.5 },
    { code: 'icici', rateMin: 8.75, rateMax: 12.00, minCredit: 700, maxAge: 96, minIncome: 25000, minLoan: 200000, maxLoan: 5000000, approval: 68.0 },
    { code: 'axis', rateMin: 8.65, rateMax: 11.75, minCredit: 700, maxAge: 96, minIncome: 25000, minLoan: 250000, maxLoan: 4000000, approval: 65.0 },
    { code: 'kotak', rateMin: 8.25, rateMax: 10.50, minCredit: 725, maxAge: 84, minIncome: 35000, minLoan: 400000, maxLoan: 5000000, approval: 78.0 },
    { code: 'indusind', rateMin: 9.00, rateMax: 12.50, minCredit: 680, maxAge: 108, minIncome: 20000, minLoan: 200000, maxLoan: 4500000, approval: 62.0 },
    { code: 'au', rateMin: 9.50, rateMax: 14.00, minCredit: 650, maxAge: 120, minIncome: 18000, minLoan: 150000, maxLoan: 3500000, approval: 58.0 },
    { code: 'shriram', rateMin: 11.00, rateMax: 16.00, minCredit: 600, maxAge: 180, minIncome: 15000, minLoan: 100000, maxLoan: 3000000, approval: 55.0 },
    { code: 'chola', rateMin: 10.50, rateMax: 15.00, minCredit: 625, maxAge: 144, minIncome: 15000, minLoan: 150000, maxLoan: 3500000, approval: 60.0 },
    { code: 'mahindra_finance', rateMin: 10.00, rateMax: 14.50, minCredit: 610, maxAge: 180, minIncome: 12000, minLoan: 100000, maxLoan: 4000000, approval: 57.0 },
  ];

  for (const rule of bankRateData) {
    const bank = await prisma.bank.findFirst({ where: { tenantId: DEFAULT_TENANT_ID, code: rule.code } });
    if (!bank) continue;

    await prisma.bankRule.upsert({
      where: { uq_bank_rules_bank_product: { tenantId: DEFAULT_TENANT_ID, bankId: bank.id, loanProductCode: 'refinance_loan' } },
      update: {
        interestRateMin: rule.rateMin,
        interestRateMax: rule.rateMax,
        historicalApprovalRate: rule.approval,
      },
      create: {
        tenantId: DEFAULT_TENANT_ID,
        bankId: bank.id,
        loanProductCode: 'refinance_loan',
        minCreditScore: rule.minCredit,
        maxVehicleAgeMonths: rule.maxAge,
        minMonthlyIncome: rule.minIncome,
        acceptedEmploymentTypes: ['salaried', 'self_employed', 'business'],
        serviceableCities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'],
        minLoanAmount: rule.minLoan,
        maxLoanAmount: rule.maxLoan,
        interestRateMin: rule.rateMin,
        interestRateMax: rule.rateMax,
        historicalApprovalRate: rule.approval,
        isActive: true,
      },
    });
    console.log(`  ✅ BankRule: ${rule.code} → refinance_loan (${rule.rateMin}%-${rule.rateMax}%)`);
  }

  // 5. Lead Sources
  const leadSources: { name: string; type: LeadSourceType }[] = [
    { name: 'Meta Lead Ads', type: 'meta_lead_ads' },
    { name: 'Google Lead Forms', type: 'google_lead_forms' },
    { name: 'Landing Page', type: 'landing_page' },
    { name: 'WhatsApp Campaign', type: 'whatsapp_campaign' },
    { name: 'Referral Partner', type: 'referral_partner' },
    { name: 'Dealer Network', type: 'dealer_network' },
    { name: 'Savings Calculator', type: 'savings_calculator' },
    { name: 'Foreclosure Calculator', type: 'foreclosure_calculator' },
    { name: 'Google Ads', type: 'google_ads' },
    { name: 'Website', type: 'website' },
  ];

  for (const sourceData of leadSources) {
    const source = await prisma.leadSource.upsert({
      where: { uq_lead_sources_tenant_name: { tenantId: DEFAULT_TENANT_ID, name: sourceData.name } },
      update: {},
      create: {
        tenantId: DEFAULT_TENANT_ID,
        name: sourceData.name,
        type: sourceData.type,
        config: {},
        isActive: true,
      },
    });
    console.log(`  ✅ LeadSource: ${source.name} (${source.type})`);
  }

  console.log('\n🎉 Seed complete!');
  console.log(`   Tenant: 1`);
  console.log(`   Roles: 5`);
  console.log(`   Banks: 9`);
  console.log(`   Bank Rules: 9 (refinance product)`);
  console.log(`   Lead Sources: 10`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
