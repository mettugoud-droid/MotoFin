"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleNotificationProvider = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let ConsoleNotificationProvider = class ConsoleNotificationProvider {
    logger = new common_1.Logger('NotificationProvider:Console');
    name = 'console';
    async send(payload) {
        const messageId = (0, crypto_1.randomUUID)();
        const message = this.renderTemplate(payload.templateName, payload.templateVariables);
        this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.logger.log(`📱 NOTIFICATION SENT [${this.name}]`);
        this.logger.log(`   To: ${payload.recipientName} (${payload.recipientMobile})`);
        this.logger.log(`   Template: ${payload.templateName}`);
        this.logger.log(`   Message ID: ${messageId}`);
        this.logger.log('   ─────────────────────────────────────────────────');
        message.split('\n').forEach((line) => {
            this.logger.log(`   ${line}`);
        });
        this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return {
            success: true,
            provider: this.name,
            messageId,
            error: null,
            timestamp: new Date().toISOString(),
        };
    }
    isAvailable() {
        return true;
    }
    renderTemplate(templateName, variables) {
        const templates = {
            lead_welcome: [
                `Hello {{name}},`,
                ``,
                `Thank you for using MotoFin EMI Savings Calculator.`,
                ``,
                `Your savings estimate has been generated successfully.`,
                ``,
                `A loan specialist will contact you shortly.`,
                ``,
                `Team MotoFin`,
            ].join('\n'),
            lead_savings_summary: [
                `Hi {{name}},`,
                ``,
                `Great news! You can save ₹{{monthlySaving}}/month on your car loan.`,
                ``,
                `Recommended Bank: {{recommendedBank}}`,
                `New Rate: {{offeredRate}}%`,
                ``,
                `Our team will guide you through the process.`,
                ``,
                `Team MotoFin`,
            ].join('\n'),
        };
        let template = templates[templateName] || templates['lead_welcome'];
        for (const [key, value] of Object.entries(variables)) {
            template = template.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        }
        return template;
    }
};
exports.ConsoleNotificationProvider = ConsoleNotificationProvider;
exports.ConsoleNotificationProvider = ConsoleNotificationProvider = __decorate([
    (0, common_1.Injectable)()
], ConsoleNotificationProvider);
//# sourceMappingURL=console-notification.provider.js.map