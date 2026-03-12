import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { CannotFollowSelfException } from '../../domain/exceptions/cannot-follow-self.exception';
import { AlreadyFollowingException } from '../../domain/exceptions/already-following.exception';
import { UserNotFoundException } from '../../../users/domain/exceptions/user-not-found.exception';

@Injectable()
export class FollowUserUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(followerId: string, followedId: string): Promise<any> {
    if (followerId === followedId) throw new CannotFollowSelfException();

    const targetUser = await this.userRepository.getUserById(followedId);
    if (!targetUser) throw new UserNotFoundException();

    const existing = await this.subscriptionRepository.findSubscription(followerId, followedId);
    if (existing) throw new AlreadyFollowingException();

    const subscription = SubscriptionEntity.create(followerId, followedId);
    await this.subscriptionRepository.follow(subscription);
    return subscription.toJSON();
  }
}
