import { v4 } from 'uuid';

export type NotificationType = 
  | 'POST_PENDING_REVIEW'
  | 'POST_APPROVED'
  | 'POST_REJECTED'
  | 'POST_DELETED'
  | 'NEW_COMMENT'
  | 'NEW_POST_FROM_FOLLOWED';

export class NotificationEntity {
  private _userId: string;
  private _type: NotificationType;
  private _title: string;
  private _message: string;
  private _link: string;
  private _isRead: boolean;
  private _createdAt: Date;
  private _metadata: Record<string, unknown>;

  private constructor(
    readonly id: string,
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link: string,
    isRead: boolean = false,
    createdAt: Date = new Date(),
    metadata: Record<string, unknown> = {},
  ) {
    this._userId = userId;
    this._type = type;
    this._title = title;
    this._message = message;
    this._link = link;
    this._isRead = isRead;
    this._createdAt = createdAt;
    this._metadata = metadata;
  }

  public get userId() {
    return this._userId;
  }

  public get isRead() {
    return this._isRead;
  }

  public static create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link: string,
    metadata: Record<string, unknown> = {},
  ): NotificationEntity {
    return new NotificationEntity(v4(), userId, type, title, message, link, false, new Date(), metadata);
  }

  public static reconstitute(input: Record<string, unknown>): NotificationEntity {
    return new NotificationEntity(
      input.id as string,
      input.userId as string,
      input.type as NotificationType,
      input.title as string,
      input.message as string,
      input.link as string,
      input.isRead as boolean,
      new Date(input.createdAt as string),
      input.metadata ? JSON.parse(input.metadata as string) : {},
    );
  }

  public markAsRead(): void {
    this._isRead = true;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      userId: this._userId,
      type: this._type,
      title: this._title,
      message: this._message,
      link: this._link,
      isRead: this._isRead,
      createdAt: this._createdAt,
      metadata: this._metadata,
    };
  }
}
