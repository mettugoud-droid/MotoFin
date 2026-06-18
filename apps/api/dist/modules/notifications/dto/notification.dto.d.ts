export declare class SendNotificationDto {
    recipientMobile: string;
    recipientName: string;
    templateName: string;
    templateVariables: Record<string, string>;
    leadId?: string;
    source?: string;
}
export declare class NotificationLogEntry {
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
//# sourceMappingURL=notification.dto.d.ts.map