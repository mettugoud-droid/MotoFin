"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const configuration_1 = require("./config/configuration");
const validation_schema_1 = require("./config/validation.schema");
const health_module_1 = require("./modules/health/health.module");
const prisma_module_1 = require("./modules/prisma/prisma.module");
const shared_module_1 = require("./modules/shared/shared.module");
const notification_module_1 = require("./modules/notifications/notification.module");
const savings_calculator_module_1 = require("./modules/savings-calculator/savings-calculator.module");
const lead_capture_module_1 = require("./modules/lead-capture/lead-capture.module");
const pre_approval_module_1 = require("./modules/pre-approval/pre-approval.module");
const foreclosure_calculator_module_1 = require("./modules/foreclosure-calculator/foreclosure-calculator.module");
const lead_acquisition_module_1 = require("./modules/lead-acquisition/lead-acquisition.module");
const opportunity_detection_module_1 = require("./modules/opportunity-detection/opportunity-detection.module");
const lead_assignment_module_1 = require("./modules/lead-assignment/lead-assignment.module");
const crm_module_1 = require("./modules/crm/crm.module");
const document_management_module_1 = require("./modules/document-management/document-management.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.configuration],
                validationSchema: validation_schema_1.validationSchema,
                validationOptions: { abortEarly: false },
            }),
            throttler_1.ThrottlerModule.forRoot([
                { name: 'short', ttl: 1000, limit: 10 },
                { name: 'long', ttl: 60000, limit: 100 },
            ]),
            prisma_module_1.PrismaModule,
            shared_module_1.SharedModule,
            notification_module_1.NotificationModule,
            health_module_1.HealthModule,
            savings_calculator_module_1.SavingsCalculatorModule,
            lead_capture_module_1.LeadCaptureModule,
            pre_approval_module_1.PreApprovalModule,
            foreclosure_calculator_module_1.ForeclosureCalculatorModule,
            lead_acquisition_module_1.LeadAcquisitionModule,
            opportunity_detection_module_1.OpportunityDetectionModule,
            lead_assignment_module_1.LeadAssignmentModule,
            crm_module_1.CrmModule,
            document_management_module_1.DocumentManagementModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map