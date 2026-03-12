import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { UserModule } from '../users/user.module';
import { PostModule } from '../posts/post.module';
import { SubscriptionModule } from '../subscriptions/subscription.module';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { SQLiteNotificationRepository } from './infrastructure/repositories/notification.sqlite.repository';
import { NotificationController } from './infrastructure/controllers/notification.controller';
import { GetNotificationsUseCase } from './application/use-cases/get-notifications.use-case';
import { MarkNotificationReadUseCase } from './application/use-cases/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from './application/use-cases/mark-all-notifications-read.use-case';
import { CommentCreatedHandler } from './application/handlers/comment-created.handler';
import { PostStatusChangedHandler } from './application/handlers/post-status-changed.handler';

@Module({
  imports: [AuthModule, UserModule, PostModule, SubscriptionModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: NotificationRepository,
      useClass: SQLiteNotificationRepository,
    },
    GetNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
    CommentCreatedHandler,
    PostStatusChangedHandler,
  ],
})
export class NotificationModule {}
