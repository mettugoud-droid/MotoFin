"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const notification_service_1 = require("../notification.service");
const notification_provider_interface_1 = require("../providers/notification-provider.interface");
describe('NotificationService', () => {
    let service;
    let mockProvider;
    const successResult = {
        success: true,
        provider: 'mock',
        messageId: 'msg-123',
        error: null,
        timestamp: new Date().toISOString(),
    };
    const failureResult = {
        success: false,
        provider: 'mock',
        messageId: null,
        error: 'Delivery failed',
        timestamp: new Date().toISOString(),
    };
    beforeEach(async () => {
        mockProvider = {
            name: 'mock',
            send: jest.fn().mockResolvedValue(successResult),
            isAvailable: jest.fn().mockReturnValue(true),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                notification_service_1.NotificationService,
                { provide: notification_provider_interface_1.NOTIFICATION_PROVIDER, useValue: mockProvider },
            ],
        }).compile();
        service = module.get(notification_service_1.NotificationService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('sendNotification', () => {
        it('should send notification successfully on first attempt', async () => {
            const result = await service.sendNotification({
                recipientMobile: '9876543210',
                recipientName: 'Surender Goud',
                templateName: 'lead_welcome',
                templateVariables: { name: 'Surender Goud' },
            });
            expect(result.success).toBe(true);
            expect(result.messageId).toBe('msg-123');
            expect(mockProvider.send).toHaveBeenCalledTimes(1);
        });
        it('should retry on failure and succeed on second attempt', async () => {
            mockProvider.send
                .mockResolvedValueOnce(failureResult)
                .mockResolvedValueOnce(successResult);
            const result = await service.sendNotification({
                recipientMobile: '9876543210',
                recipientName: 'Test User',
                templateName: 'lead_welcome',
                templateVariables: { name: 'Test User' },
            });
            expect(result.success).toBe(true);
            expect(mockProvider.send).toHaveBeenCalledTimes(2);
        });
        it('should fail after max retries exhausted', async () => {
            mockProvider.send.mockResolvedValue(failureResult);
            const result = await service.sendNotification({
                recipientMobile: '9876543210',
                recipientName: 'Test User',
                templateName: 'lead_welcome',
                templateVariables: { name: 'Test User' },
            });
            expect(result.success).toBe(false);
            expect(result.error).toContain('Failed after 3 attempts');
            expect(mockProvider.send).toHaveBeenCalledTimes(3);
        });
        it('should handle provider exception with retry', async () => {
            mockProvider.send
                .mockRejectedValueOnce(new Error('Network timeout'))
                .mockResolvedValueOnce(successResult);
            const result = await service.sendNotification({
                recipientMobile: '9876543210',
                recipientName: 'Test User',
                templateName: 'lead_welcome',
                templateVariables: { name: 'Test User' },
            });
            expect(result.success).toBe(true);
            expect(mockProvider.send).toHaveBeenCalledTimes(2);
        });
        it('should return failure when provider is not available', async () => {
            mockProvider.isAvailable.mockReturnValue(false);
            const result = await service.sendNotification({
                recipientMobile: '9876543210',
                recipientName: 'Test User',
                templateName: 'lead_welcome',
                templateVariables: { name: 'Test User' },
            });
            expect(result.success).toBe(false);
            expect(result.error).toBe('Provider not available');
            expect(mockProvider.send).not.toHaveBeenCalled();
        });
        it('should pass correct payload to provider', async () => {
            await service.sendNotification({
                recipientMobile: '9876543210',
                recipientName: 'Surender Goud',
                templateName: 'lead_welcome',
                templateVariables: { name: 'Surender Goud' },
                leadId: 'lead-uuid',
                source: 'lead_capture',
            });
            expect(mockProvider.send).toHaveBeenCalledWith(expect.objectContaining({
                recipientMobile: '9876543210',
                recipientName: 'Surender Goud',
                templateName: 'lead_welcome',
                templateVariables: { name: 'Surender Goud' },
                metadata: { leadId: 'lead-uuid', source: 'lead_capture' },
            }));
        });
    });
    describe('sendLeadWelcomeNotification', () => {
        it('should use lead_welcome template when no savings data', async () => {
            await service.sendLeadWelcomeNotification({
                name: 'Surender Goud',
                mobile: '9876543210',
                leadId: 'lead-uuid',
            });
            expect(mockProvider.send).toHaveBeenCalledWith(expect.objectContaining({
                templateName: 'lead_welcome',
            }));
        });
        it('should use lead_savings_summary template when savings data available', async () => {
            await service.sendLeadWelcomeNotification({
                name: 'Surender Goud',
                mobile: '9876543210',
                leadId: 'lead-uuid',
                monthlySaving: 2500,
                recommendedBank: 'HDFC Bank',
                offeredRate: 8.5,
            });
            expect(mockProvider.send).toHaveBeenCalledWith(expect.objectContaining({
                templateName: 'lead_savings_summary',
                templateVariables: expect.objectContaining({
                    name: 'Surender Goud',
                    monthlySaving: '2,500',
                    recommendedBank: 'HDFC Bank',
                    offeredRate: '8.5',
                }),
            }));
        });
        it('should use lead_welcome when monthlySaving is 0', async () => {
            await service.sendLeadWelcomeNotification({
                name: 'Test User',
                mobile: '9876543210',
                leadId: 'lead-uuid',
                monthlySaving: 0,
            });
            expect(mockProvider.send).toHaveBeenCalledWith(expect.objectContaining({
                templateName: 'lead_welcome',
            }));
        });
    });
});
//# sourceMappingURL=notification.service.spec.js.map