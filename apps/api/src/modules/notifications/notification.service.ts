import { Injectable, Logger, Inject } from '@nestjs/common';

import {
  NotificationProvider,
  NotificationPayload,
  NotificationResult,
  NOTIFICATION_PROVIDER,
} from './providers/notification-provider.interface';
import { SendNotificationDto } from './dto/notification.dto';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(NOTIFICATION_PROVIDER)
    private readonly provider: NotificationProvider,
  ) {}

  /**
   * Send a notification to a customer.
   * Handles retries and failure logging.
   */
  async sendNotification(dto: SendNotificationDto): Promise<NotificationResult> {
    const payload: NotificationPayload = {
      recipientMobile: dto.recipientMobile,
      recipientName: dto.recipientName,
      templateName: dto.templateName,
      templateVariables: dto.templateVariables,
      metadata: {
        leadId: dto.leadId,
        source: dto.source,
      },
    };

    // Check provider availability
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

    // Attempt with retries
    let lastError: string | null = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await this.provider.send(payload);

        if (result.success) {
          this.logger.log(
            `Notification sent successfully to ${dto.recipientName} (${dto.recipientMobile}) via ${this.provider.name} [attempt ${attempt}]`,
          );
          return result;
        }

        lastError = result.error;
        this.logger.warn(
          `Notification attempt ${attempt}/${MAX_RETRIES} failed: ${result.error}`,
        );
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(
          `Notification attempt ${attempt}/${MAX_RETRIES} threw exception: ${lastError}`,
        );
      }

      // Wait before retry (except on last attempt)
      if (attempt < MAX_RETRIES) {
        await this.delay(RETRY_DELAY_MS * attempt);
      }
    }

    // All retries exhausted
    this.logger.error(
      `Notification FAILED after ${MAX_RETRIES} attempts to ${dto.recipientMobile}: ${lastError}`,
    );

    return {
      success: false,
      provider: this.provider.name,
      messageId: null,
      error: `Failed after ${MAX_RETRIES} attempts: ${lastError}`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Send lead welcome notification.
   * Called after a new lead is captured.
   */
  async sendLeadWelcomeNotification(params: {
    name: string;
    mobile: string;
    leadId: string;
    monthlySaving?: number;
    recommendedBank?: string;
    offeredRate?: number;
  }): Promise<NotificationResult> {
    const { name, mobile, leadId, monthlySaving, recommendedBank, offeredRate } = params;

    // Choose template based on available data
    const templateName = monthlySaving && monthlySaving > 0
      ? 'lead_savings_summary'
      : 'lead_welcome';

    const templateVariables: Record<string, string> = {
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

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
