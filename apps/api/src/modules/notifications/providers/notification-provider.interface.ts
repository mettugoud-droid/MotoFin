/**
 * Notification Provider Interface.
 * All notification delivery providers (Console, WhatsApp, Interakt, Twilio)
 * must implement this interface.
 */
export interface NotificationPayload {
  recipientMobile: string;
  recipientName: string;
  templateName: string;
  templateVariables: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface NotificationResult {
  success: boolean;
  provider: string;
  messageId: string | null;
  error: string | null;
  timestamp: string;
}

export interface NotificationProvider {
  /** Unique provider identifier */
  readonly name: string;

  /** Send a notification message */
  send(payload: NotificationPayload): Promise<NotificationResult>;

  /** Check if the provider is available/configured */
  isAvailable(): boolean;
}

export const NOTIFICATION_PROVIDER = 'NOTIFICATION_PROVIDER';
