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
    readonly name: string;
    send(payload: NotificationPayload): Promise<NotificationResult>;
    isAvailable(): boolean;
}
export declare const NOTIFICATION_PROVIDER = "NOTIFICATION_PROVIDER";
//# sourceMappingURL=notification-provider.interface.d.ts.map