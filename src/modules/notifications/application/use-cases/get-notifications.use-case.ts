import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class GetNotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  public async execute(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
    isRead?: string,
  ): Promise<any> {
    let isReadFilter: boolean | undefined;
    if (isRead === 'true') isReadFilter = true;
    else if (isRead === 'false') isReadFilter = false;

    const { notifications, total, unreadCount } =
      await this.notificationRepository.getNotificationsByUserId(userId, page, pageSize, isReadFilter);

    return {
      notifications: notifications.map((n) => {
        const json = n.toJSON();
        const { userId: _, ...rest } = json as any;
        return rest;
      }),
      total,
      unreadCount,
      page,
      pageSize,
    };
  }
}
