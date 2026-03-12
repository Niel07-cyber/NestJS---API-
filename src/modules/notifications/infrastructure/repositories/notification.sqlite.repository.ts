import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { SQLiteNotificationEntity } from '../entities/notification.sqlite.entity';

@Injectable()
export class SQLiteNotificationRepository extends NotificationRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  public async createNotification(notification: NotificationEntity): Promise<void> {
    const json = notification.toJSON();
    await this.dataSource.getRepository(SQLiteNotificationEntity).save({
      ...json,
      metadata: JSON.stringify(json.metadata),
    });
  }

  public async getNotificationById(id: string): Promise<NotificationEntity | undefined> {
    const notif = await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .findOne({ where: { id } });
    return notif ? NotificationEntity.reconstitute({ ...notif }) : undefined;
  }

  public async getNotificationsByUserId(
    userId: string,
    page: number,
    pageSize: number,
    isRead?: boolean,
  ): Promise<{ notifications: NotificationEntity[]; total: number; unreadCount: number }> {
    const where: any = { userId };
    if (isRead !== undefined) where.isRead = isRead;

    const [results, total] = await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .findAndCount({
        where,
        order: { createdAt: 'DESC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

    const unreadCount = await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .count({ where: { userId, isRead: false } });

    return {
      notifications: results.map((n) => NotificationEntity.reconstitute({ ...n })),
      total,
      unreadCount,
    };
  }

  public async markAsRead(id: string): Promise<void> {
    await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .update(id, { isRead: true });
  }

  public async markAllAsRead(userId: string): Promise<number> {
    const result = await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .update({ userId, isRead: false }, { isRead: true });
    return result.affected ?? 0;
  }
}
