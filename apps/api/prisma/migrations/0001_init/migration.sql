-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'DOCS_PENDING', 'DOCS_RECEIVED', 'BANK_SUBMITTED', 'APPROVED', 'DISBURSED', 'REJECTED', 'CLOSED', 'ALL_REJECTED');

-- CreateEnum
CREATE TYPE "OpportunityCategory" AS ENUM ('used_car_buyer', 'refinance_opportunity', 'balance_transfer_opportunity', 'top_up_opportunity', 'loan_against_vehicle', 'uncategorized');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('salaried', 'self_employed', 'business');

-- CreateEnum
CREATE TYPE "LeadSourceType" AS ENUM ('meta_lead_ads', 'google_lead_forms', 'landing_page', 'whatsapp_campaign', 'referral_partner', 'dealer_network', 'savings_calculator', 'foreclosure_calculator', 'google_ads', 'website');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('high', 'moderate', 'subject_to_verification');

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "domain" VARCHAR(255),
    "settings" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "supabase_uid" VARCHAR(255) NOT NULL,
    "role_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "city" VARCHAR(100),
    "product_expertise" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "max_active_leads" INTEGER NOT NULL DEFAULT 50,
    "last_assignment_at" TIMESTAMPTZ,
    "last_login_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_sources" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "LeadSourceType" NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "lead_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_mobile" VARCHAR(10) NOT NULL,
    "customer_name" VARCHAR(255) NOT NULL,
    "customer_email" VARCHAR(255),
    "customer_city" VARCHAR(100),
    "lead_source_id" UUID NOT NULL,
    "assigned_to" UUID,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "opportunity_category" "OpportunityCategory",
    "opportunity_score" INTEGER,
    "score_is_partial" BOOLEAN NOT NULL DEFAULT false,
    "matched_signals" JSONB NOT NULL DEFAULT '[]',
    "existing_loan_details" JSONB,
    "requested_loan_amount" DECIMAL(12,2),
    "source_timestamp" TIMESTAMPTZ NOT NULL,
    "assigned_at" TIMESTAMPTZ,
    "last_interaction_at" TIMESTAMPTZ,
    "utm_source" VARCHAR(100),
    "utm_medium" VARCHAR(100),
    "utm_campaign" VARCHAR(200),
    "utm_content" VARCHAR(200),
    "utm_term" VARCHAR(200),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "contact_info" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_rules" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "bank_id" UUID NOT NULL,
    "loan_product_code" VARCHAR(50) NOT NULL,
    "min_credit_score" INTEGER,
    "max_vehicle_age_months" INTEGER,
    "min_monthly_income" DECIMAL(12,2),
    "accepted_employment_types" "EmploymentType"[] DEFAULT ARRAY[]::"EmploymentType"[],
    "serviceable_cities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "min_loan_amount" DECIMAL(12,2),
    "max_loan_amount" DECIMAL(12,2),
    "interest_rate_min" DECIMAL(5,2),
    "interest_rate_max" DECIMAL(5,2),
    "historical_approval_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "effective_from" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "bank_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_calculations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "session_id" VARCHAR(100) NOT NULL,
    "current_emi" DECIMAL(12,2) NOT NULL,
    "outstanding_amount" DECIMAL(14,2) NOT NULL,
    "current_rate" DECIMAL(5,2) NOT NULL,
    "remaining_tenure" INTEGER NOT NULL,
    "original_tenure" INTEGER NOT NULL,
    "monthly_saving" DECIMAL(12,2),
    "total_interest_saving" DECIMAL(14,2),
    "top_up_eligible" BOOLEAN,
    "top_up_amount" DECIMAL(14,2),
    "recommended_bank" VARCHAR(100),
    "bank_comparisons" JSONB NOT NULL DEFAULT '[]',
    "response_time_ms" INTEGER NOT NULL,
    "lead_captured" BOOLEAN NOT NULL DEFAULT false,
    "lead_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "savings_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_approval_results" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "source_type" VARCHAR(50) NOT NULL,
    "source_calculation_id" UUID NOT NULL,
    "approval_probability" DECIMAL(5,2) NOT NULL,
    "confidence_level" "ConfidenceLevel" NOT NULL,
    "top_up_amount" DECIMAL(14,2),
    "recommended_banks" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pre_approval_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foreclosure_calculations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "session_id" VARCHAR(100) NOT NULL,
    "current_bank" VARCHAR(100) NOT NULL,
    "current_emi" DECIMAL(12,2) NOT NULL,
    "loan_start_date" DATE NOT NULL,
    "outstanding_amount" DECIMAL(14,2) NOT NULL,
    "current_rate" DECIMAL(5,2) NOT NULL,
    "foreclosure_amount" DECIMAL(14,2),
    "preclosure_charges" DECIMAL(12,2),
    "net_savings" DECIMAL(14,2),
    "takeover_eligible" BOOLEAN,
    "best_refinance_bank" VARCHAR(100),
    "response_time_ms" INTEGER NOT NULL,
    "lead_captured" BOOLEAN NOT NULL DEFAULT false,
    "lead_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "foreclosure_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "roles_tenant_id_name_key" ON "roles"("tenant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "users_supabase_uid_key" ON "users"("supabase_uid");

-- CreateIndex
CREATE INDEX "idx_users_active_assignment" ON "users"("tenant_id", "is_active", "last_assignment_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenant_id_email_key" ON "users"("tenant_id", "email");

-- CreateIndex
CREATE INDEX "idx_lead_sources_tenant_type" ON "lead_sources"("tenant_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "lead_sources_tenant_id_name_key" ON "lead_sources"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "idx_leads_tenant_status" ON "leads"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "idx_leads_assigned_to" ON "leads"("tenant_id", "assigned_to");

-- CreateIndex
CREATE INDEX "idx_leads_customer_mobile" ON "leads"("tenant_id", "customer_mobile");

-- CreateIndex
CREATE INDEX "idx_leads_opportunity_score" ON "leads"("tenant_id", "opportunity_score" DESC);

-- CreateIndex
CREATE INDEX "idx_leads_created_at" ON "leads"("tenant_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_leads_source_id" ON "leads"("tenant_id", "lead_source_id");

-- CreateIndex
CREATE INDEX "idx_banks_tenant_active" ON "banks"("tenant_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "banks_tenant_id_code_key" ON "banks"("tenant_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "banks_tenant_id_name_key" ON "banks"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "idx_bank_rules_active" ON "bank_rules"("tenant_id", "is_active");

-- CreateIndex
CREATE INDEX "idx_bank_rules_bank_id" ON "bank_rules"("bank_id");

-- CreateIndex
CREATE UNIQUE INDEX "bank_rules_tenant_id_bank_id_loan_product_code_key" ON "bank_rules"("tenant_id", "bank_id", "loan_product_code");

-- CreateIndex
CREATE INDEX "idx_savings_calc_created" ON "savings_calculations"("tenant_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_savings_calc_session" ON "savings_calculations"("session_id");

-- CreateIndex
CREATE INDEX "idx_savings_calc_lead_id" ON "savings_calculations"("lead_id");

-- CreateIndex
CREATE INDEX "idx_pre_approval_created" ON "pre_approval_results"("tenant_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_pre_approval_source_calc" ON "pre_approval_results"("source_calculation_id");

-- CreateIndex
CREATE INDEX "idx_fc_created" ON "foreclosure_calculations"("tenant_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_fc_session" ON "foreclosure_calculations"("session_id");

-- CreateIndex
CREATE INDEX "idx_fc_lead_id" ON "foreclosure_calculations"("lead_id");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_sources" ADD CONSTRAINT "lead_sources_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_lead_source_id_fkey" FOREIGN KEY ("lead_source_id") REFERENCES "lead_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banks" ADD CONSTRAINT "banks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_rules" ADD CONSTRAINT "bank_rules_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_rules" ADD CONSTRAINT "bank_rules_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_calculations" ADD CONSTRAINT "savings_calculations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_calculations" ADD CONSTRAINT "savings_calculations_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_approval_results" ADD CONSTRAINT "pre_approval_results_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foreclosure_calculations" ADD CONSTRAINT "foreclosure_calculations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foreclosure_calculations" ADD CONSTRAINT "foreclosure_calculations_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

