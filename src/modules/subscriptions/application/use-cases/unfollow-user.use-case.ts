import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { NotFollowingException } from '../../domain/exceptions/not-following.exception';
import { UserNotFoundException } from '../../../users/domain/exceptions/user-not-found.exception';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(followerId: string, followedId: string): Promise<void> {
    const targetUser = await this.userRepository.getUserById(followedId);
    if (!targetUser) throw new UserNotFoundException();

    const existing = await this.subscriptionRepository.findSubscription(followerId, followedId);
    if (!existing) throw new NotFollowingException();

    await this.subscriptionRepository.unfollow(followerId, followedId);
  }
}
