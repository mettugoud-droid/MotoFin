import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

import {
  NotificationProvider,
  NotificationPayload,
  NotificationResult,
} from './notification-provider.interface';

/**
 * Console Notification Provider.
 * Logs notifications to stdout for development/MVP.
 * Will be replaced by WhatsApp Cloud API provider in production.
 */
@Injectable()
export class ConsoleNotificationProvider implements NotificationProvider {
  private readonly logger = new Logger('NotificationProvider:Console');

  readonly name = 'console';

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const messageId = randomUUID();

    // Render template
    const message = this.renderTemplate(payload.templateName, payload.templateVariables);

    // Log the notification (simulates sending)
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

  isAvailable(): boolean {
    return true; // Console provider is always available
  }

  private renderTemplate(templateName: string, variables: Record<string, string>): string {
    const templates: Record<string, string> = {
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

    // Replace template variables
    for (const [key, value] of Object.entries(variables)) {
      template = template.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }

    return template;
  }
}
