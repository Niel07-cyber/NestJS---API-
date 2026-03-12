import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { FollowUserUseCase } from '../../application/use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from '../../application/use-cases/unfollow-user.use-case';
import { GetFollowersUseCase } from '../../application/use-cases/get-followers.use-case';
import { GetFollowingUseCase } from '../../application/use-cases/get-following.use-case';

@Controller('users')
export class SubscriptionController {
  constructor(
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
    private readonly getFollowersUseCase: GetFollowersUseCase,
    private readonly getFollowingUseCase: GetFollowingUseCase,
  ) {}

  @Post(':userId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  public async follow(
    @Requester() user: UserEntity,
    @Param('userId') userId: string,
  ) {
    return this.followUserUseCase.execute(user.id, userId);
  }

  @Delete(':userId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  public async unfollow(
    @Requester() user: UserEntity,
    @Param('userId') userId: string,
  ) {
    await this.unfollowUserUseCase.execute(user.id, userId);
  }

  @Get(':userId/followers')
  public async getFollowers(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.getFollowersUseCase.execute(
      userId,
      page ? parseInt(page) : 1,
      pageSize ? Math.min(parseInt(pageSize), 100) : 20,
    );
  }

  @Get(':userId/following')
  public async getFollowing(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.getFollowingUseCase.execute(
      userId,
      page ? parseInt(page) : 1,
      pageSize ? Math.min(parseInt(pageSize), 100) : 20,
    );
  }
}
