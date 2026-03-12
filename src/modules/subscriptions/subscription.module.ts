import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { UserModule } from '../users/user.module';
import { SubscriptionRepository } from './domain/repositories/subscription.repository';
import { SQLiteSubscriptionRepository } from './infrastructure/repositories/subscription.sqlite.repository';
import { SubscriptionController } from './infrastructure/controllers/subscription.controller';
import { FollowUserUseCase } from './application/use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from './application/use-cases/unfollow-user.use-case';
import { GetFollowersUseCase } from './application/use-cases/get-followers.use-case';
import { GetFollowingUseCase } from './application/use-cases/get-following.use-case';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [SubscriptionController],
  providers: [
    {
      provide: SubscriptionRepository,
      useClass: SQLiteSubscriptionRepository,
    },
    FollowUserUseCase,
    UnfollowUserUseCase,
    GetFollowersUseCase,
    GetFollowingUseCase,
  ],
  exports: [SubscriptionRepository],
})
export class SubscriptionModule {}
