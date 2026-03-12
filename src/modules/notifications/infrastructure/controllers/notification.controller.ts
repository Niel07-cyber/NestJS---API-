import {
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { GetNotificationsUseCase } from '../../application/use-cases/get-notifications.use-case';
import { MarkNotificationReadUseCase } from '../../application/use-cases/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from '../../application/use-cases/mark-all-notifications-read.use-case';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getNotifications(
    @Requester() user: UserEntity,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('isRead') isRead?: string,
  ) {
    return this.getNotificationsUseCase.execute(
      user.id,
      page ? parseInt(page) : 1,
      pageSize ? Math.min(parseInt(pageSize), 100) : 20,
      isRead,
    );
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  public async markAsRead(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    return this.markNotificationReadUseCase.execute(id, user.id);
  }

  @Post('mark-all-read')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  public async markAllAsRead(@Requester() user: UserEntity) {
    return this.markAllNotificationsReadUseCase.execute(user.id);
  }
}
