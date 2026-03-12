import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { UserNotFoundException } from '../../../users/domain/exceptions/user-not-found.exception';

@Injectable()
export class GetFollowingUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(userId: string, page: number = 1, pageSize: number = 20): Promise<any> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new UserNotFoundException();

    const { subscriptions, total } = await this.subscriptionRepository.getFollowing(userId, page, pageSize);

    const following = await Promise.all(
      subscriptions.map(async (sub) => {
        const json = sub.toJSON();
        const followed = await this.userRepository.getUserById(json.followedId as string);
        const followedJson = followed?.toJSON();
        return {
          id: followedJson?.id,
          username: followedJson?.username,
          followedAt: json.followedAt,
        };
      }),
    );

    return { following, total, page, pageSize };
  }
}
