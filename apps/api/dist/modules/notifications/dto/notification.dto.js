"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationLogEntry = exports.SendNotificationDto = void 0;
class SendNotificationDto {
    recipientMobile;
    recipientName;
    templateName;
    templateVariables;
    leadId;
    source;
}
exports.SendNotificationDto = SendNotificationDto;
class NotificationLogEntry {
    id;
    recipientMobile;
    recipientName;
    templateName;
    provider;
    success;
    messageId;
    error;
    attempts;
    sentAt;
}
exports.NotificationLogEntry = NotificationLogEntry;
//# sourceMappingURL=notification.dto.js.map