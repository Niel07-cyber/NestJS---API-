import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { SQLiteSubscriptionEntity } from '../entities/subscription.sqlite.entity';

@Injectable()
export class SQLiteSubscriptionRepository extends SubscriptionRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  public async follow(subscription: SubscriptionEntity): Promise<void> {
    const json = subscription.toJSON();
    await this.dataSource.getRepository(SQLiteSubscriptionEntity).save(json);
  }

  public async unfollow(followerId: string, followedId: string): Promise<void> {
    await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .delete({ followerId, followedId });
  }

  public async findSubscription(followerId: string, followedId: string): Promise<SubscriptionEntity | undefined> {
    const sub = await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .findOne({ where: { followerId, followedId } });
    return sub ? SubscriptionEntity.reconstitute({ ...sub }) : undefined;
  }

  public async getFollowers(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<{ subscriptions: SubscriptionEntity[]; total: number }> {
    const [results, total] = await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .findAndCount({
        where: { followedId: userId },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    return {
      subscriptions: results.map((s) => SubscriptionEntity.reconstitute({ ...s })),
      total,
    };
  }

  public async getFollowing(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<{ subscriptions: SubscriptionEntity[]; total: number }> {
    const [results, total] = await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .findAndCount({
        where: { followerId: userId },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    return {
      subscriptions: results.map((s) => SubscriptionEntity.reconstitute({ ...s })),
      total,
    };
  }

  public async getFollowerIds(userId: string): Promise<string[]> {
    const subs = await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .find({ where: { followedId: userId } });
    return subs.map((s) => s.followerId);
  }
}
