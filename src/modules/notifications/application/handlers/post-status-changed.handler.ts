import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { SubscriptionRepository } from '../../../subscriptions/domain/repositories/subscription.repository';

@Injectable()
export class PostStatusChangedHandler {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  @OnEvent('post.submitted-for-review')
  public async handleSubmittedForReview(event: { postId: string; postTitle: string }) {
    const moderators = await this.userRepository.getUsersByRole('moderator');
    const admins = await this.userRepository.getUsersByRole('admin');
    const recipients = [...moderators, ...admins];

    for (const recipient of recipients) {
      const recipientJson = recipient.toJSON();
      const notification = NotificationEntity.create(
        recipientJson.id as string,
        'POST_PENDING_REVIEW',
        'New Post Pending Review',
        `New post pending review: '${event.postTitle}'`,
        `/posts/${event.postId}`,
        { postId: event.postId },
      );
      await this.notificationRepository.createNotification(notification);
    }
  }

  @OnEvent('post.approved')
  public async handleApproved(event: { postId: string; postTitle: string; postSlug: string; authorId: string }) {
    // Notify author
    const notification = NotificationEntity.create(
      event.authorId,
      'POST_APPROVED',
      'Post Approved',
      `Your post '${event.postTitle}' has been approved`,
      `/posts/${event.postSlug || event.postId}`,
      { postId: event.postId },
    );
    await this.notificationRepository.createNotification(notification);

    // Notify all followers
    const followerIds = await this.subscriptionRepository.getFollowerIds(event.authorId);
    const author = await this.userRepository.getUserById(event.authorId);
    const authorJson = author?.toJSON();

    for (const followerId of followerIds) {
      const followerNotification = NotificationEntity.create(
        followerId,
        'NEW_POST_FROM_FOLLOWED',
        'New Post',
        `${authorJson?.username} published a new post: '${event.postTitle}'`,
        `/posts/${event.postSlug || event.postId}`,
        { postId: event.postId, authorId: event.authorId },
      );
      await this.notificationRepository.createNotification(followerNotification);
    }
  }

  @OnEvent('post.rejected')
  public async handleRejected(event: { postId: string; postTitle: string; authorId: string }) {
    const notification = NotificationEntity.create(
      event.authorId,
      'POST_REJECTED',
      'Post Rejected',
      `Your post '${event.postTitle}' has been rejected`,
      `/posts/${event.postId}`,
      { postId: event.postId },
    );
    await this.notificationRepository.createNotification(notification);
  }

  @OnEvent('post.deleted')
  public async handleDeleted(event: { postId: string; postTitle: string; authorId: string; deletedById: string }) {
    // Don't notify if author deleted own post
    if (event.authorId === event.deletedById) return;

    const notification = NotificationEntity.create(
      event.authorId,
      'POST_DELETED',
      'Post Deleted',
      `Your post '${event.postTitle}' has been deleted`,
      `/posts/${event.postId}`,
      { postId: event.postId },
    );
    await this.notificationRepository.createNotification(notification);
  }
}
