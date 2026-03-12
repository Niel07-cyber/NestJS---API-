import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { UserNotFoundException } from '../../../users/domain/exceptions/user-not-found.exception';

@Injectable()
export class GetFollowersUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(userId: string, page: number = 1, pageSize: number = 20): Promise<any> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new UserNotFoundException();

    const { subscriptions, total } = await this.subscriptionRepository.getFollowers(userId, page, pageSize);

    const followers = await Promise.all(
      subscriptions.map(async (sub) => {
        const json = sub.toJSON();
        const follower = await this.userRepository.getUserById(json.followerId as string);
        const followerJson = follower?.toJSON();
        return {
          id: followerJson?.id,
          username: followerJson?.username,
          followedAt: json.followedAt,
        };
      }),
    );

    return { followers, total, page, pageSize };
  }
}
