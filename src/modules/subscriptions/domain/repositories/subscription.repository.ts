import { SubscriptionEntity } from '../entities/subscription.entity';

export abstract class SubscriptionRepository {
  public abstract follow(subscription: SubscriptionEntity): Promise<void>;
  public abstract unfollow(followerId: string, followedId: string): Promise<void>;
  public abstract findSubscription(followerId: string, followedId: string): Promise<SubscriptionEntity | undefined>;
  public abstract getFollowers(userId: string, page: number, pageSize: number): Promise<{ subscriptions: SubscriptionEntity[]; total: number }>;
  public abstract getFollowing(userId: string, page: number, pageSize: number): Promise<{ subscriptions: SubscriptionEntity[]; total: number }>;
  public abstract getFollowerIds(userId: string): Promise<string[]>;
}
