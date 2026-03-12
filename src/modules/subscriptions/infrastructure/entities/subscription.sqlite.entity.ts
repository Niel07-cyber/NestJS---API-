import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('subscriptions')
export class SQLiteSubscriptionEntity {
  @PrimaryColumn()
  followerId: string;

  @PrimaryColumn()
  followedId: string;

  @Column({ nullable: true })
  followedAt: Date;
}
