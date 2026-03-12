import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';
import { NotificationForbiddenException } from '../../domain/exceptions/notification-forbidden.exception';

@Injectable()
export class MarkNotificationReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  public async execute(notificationId: string, userId: string): Promise<any> {
    const notification = await this.notificationRepository.getNotificationById(notificationId);
    if (!notification) throw new NotificationNotFoundException();
    if (notification.userId !== userId) throw new NotificationForbiddenException();

    await this.notificationRepository.markAsRead(notificationId);
    notification.markAsRead();

    const json = notification.toJSON();
    const { userId: _, ...rest } = json as any;
    return rest;
  }
}
