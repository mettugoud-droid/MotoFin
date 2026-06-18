import { NotificationProvider, NotificationResult } from './providers/notification-provider.interface';
import { SendNotificationDto } from './dto/notification.dto';
export declare class NotificationService {
    private readonly provider;
    private readonly logger;
    constructor(provider: NotificationProvider);
    sendNotification(dto: SendNotificationDto): Promise<NotificationResult>;
    sendLeadWelcomeNotification(params: {
        name: string;
        mobile: string;
        leadId: string;
        monthlySaving?: number;
        recommendedBank?: string;
        offeredRate?: number;
    }): Promise<NotificationResult>;
    private delay;
}
//# sourceMappingURL=notification.service.d.ts.map