"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadCaptureModule = void 0;
const common_1 = require("@nestjs/common");
const lead_capture_controller_1 = require("./lead-capture.controller");
const lead_capture_service_1 = require("./lead-capture.service");
const lead_repository_1 = require("./repositories/lead.repository");
const savings_calculation_repository_1 = require("../savings-calculator/repositories/savings-calculation.repository");
let LeadCaptureModule = class LeadCaptureModule {
};
exports.LeadCaptureModule = LeadCaptureModule;
exports.LeadCaptureModule = LeadCaptureModule = __decorate([
    (0, common_1.Module)({
        controllers: [lead_capture_controller_1.LeadCaptureController],
        providers: [lead_capture_service_1.LeadCaptureService, lead_repository_1.LeadRepository, savings_calculation_repository_1.SavingsCalculationRepository],
        exports: [lead_capture_service_1.LeadCaptureService, lead_repository_1.LeadRepository],
    })
], LeadCaptureModule);
//# sourceMappingURL=lead-capture.module.js.map