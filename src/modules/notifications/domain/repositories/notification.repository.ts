import { NotificationEntity } from '../entities/notification.entity';

export abstract class NotificationRepository {
  public abstract createNotification(notification: NotificationEntity): Promise<void>;
  public abstract getNotificationById(id: string): Promise<NotificationEntity | undefined>;
  public abstract getNotificationsByUserId(
    userId: string,
    page: number,
    pageSize: number,
    isRead?: boolean,
  ): Promise<{ notifications: NotificationEntity[]; total: number; unreadCount: number }>;
  public abstract markAsRead(id: string): Promise<void>;
  public abstract markAllAsRead(userId: string): Promise<number>;
}
