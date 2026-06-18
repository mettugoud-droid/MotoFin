export class SendNotificationDto {
  recipientMobile: string;
  recipientName: string;
  templateName: string;
  templateVariables: Record<string, string>;
  leadId?: string;
  source?: string;
}

export class NotificationLogEntry {
  id: string;
  recipientMobile: string;
  recipientName: string;
  templateName: string;
  provider: string;
  success: boolean;
  messageId: string | null;
  error: string | null;
  attempts: number;
  sentAt: string;
}
