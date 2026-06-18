"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const notification_provider_interface_1 = require("./providers/notification-provider.interface");
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
let NotificationService = NotificationService_1 = class NotificationService {
    provider;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(provider) {
        this.provider = provider;
    }
    async sendNotification(dto) {
        const payload = {
            recipientMobile: dto.recipientMobile,
            recipientName: dto.recipientName,
            templateName: dto.templateName,
            templateVariables: dto.templateVariables,
            metadata: {
                leadId: dto.leadId,
                source: dto.source,
            },
        };
        if (!this.provider.isAvailable()) {
            this.logger.warn(`Notification provider '${this.provider.name}' is not available`);
            return {
                success: false,
                provider: this.provider.name,
                messageId: null,
                error: 'Provider not available',
                timestamp: new Date().toISOString(),
            };
        }
        let lastError = null;
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const result = await this.provider.send(payload);
                if (result.success) {
                    this.logger.log(`Notification sent successfully to ${dto.recipientName} (${dto.recipientMobile}) via ${this.provider.name} [attempt ${attempt}]`);
                    return result;
                }
                lastError = result.error;
                this.logger.warn(`Notification attempt ${attempt}/${MAX_RETRIES} failed: ${result.error}`);
            }
            catch (error) {
                lastError = error instanceof Error ? error.message : 'Unknown error';
                this.logger.error(`Notification attempt ${attempt}/${MAX_RETRIES} threw exception: ${lastError}`);
            }
            if (attempt < MAX_RETRIES) {
                await this.delay(RETRY_DELAY_MS * attempt);
            }
        }
        this.logger.error(`Notification FAILED after ${MAX_RETRIES} attempts to ${dto.recipientMobile}: ${lastError}`);
        return {
            success: false,
            provider: this.provider.name,
            messageId: null,
            error: `Failed after ${MAX_RETRIES} attempts: ${lastError}`,
            timestamp: new Date().toISOString(),
        };
    }
    async sendLeadWelcomeNotification(params) {
        const { name, mobile, leadId, monthlySaving, recommendedBank, offeredRate } = params;
        const templateName = monthlySaving && monthlySaving > 0
            ? 'lead_savings_summary'
            : 'lead_welcome';
        const templateVariables = {
            name,
            ...(monthlySaving && { monthlySaving: monthlySaving.toLocaleString('en-IN') }),
            ...(recommendedBank && { recommendedBank }),
            ...(offeredRate && { offeredRate: offeredRate.toString() }),
        };
        return this.sendNotification({
            recipientMobile: mobile,
            recipientName: name,
            templateName,
            templateVariables,
            leadId,
            source: 'lead_capture',
        });
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(notification_provider_interface_1.NOTIFICATION_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map