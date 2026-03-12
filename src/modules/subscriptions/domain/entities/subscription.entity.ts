export class SubscriptionEntity {
  private _followerId: string;
  private _followedId: string;
  private _followedAt: Date;

  private constructor(
    followerId: string,
    followedId: string,
    followedAt: Date = new Date(),
  ) {
    this._followerId = followerId;
    this._followedId = followedId;
    this._followedAt = followedAt;
  }

  public get followerId() {
    return this._followerId;
  }

  public get followedId() {
    return this._followedId;
  }

  public static create(followerId: string, followedId: string): SubscriptionEntity {
    return new SubscriptionEntity(followerId, followedId, new Date());
  }

  public static reconstitute(input: Record<string, unknown>): SubscriptionEntity {
    return new SubscriptionEntity(
      input.followerId as string,
      input.followedId as string,
      new Date(input.followedAt as string),
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      followerId: this._followerId,
      followedId: this._followedId,
      followedAt: this._followedAt,
    };
  }
}
