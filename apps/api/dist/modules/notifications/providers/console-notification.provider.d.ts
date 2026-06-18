import { NotificationProvider, NotificationPayload, NotificationResult } from './notification-provider.interface';
export declare class ConsoleNotificationProvider implements NotificationProvider {
    private readonly logger;
    readonly name = "console";
    send(payload: NotificationPayload): Promise<NotificationResult>;
    isAvailable(): boolean;
    private renderTemplate;
}
//# sourceMappingURL=console-notification.provider.d.ts.map