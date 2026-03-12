import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';

@Injectable()
export class CommentCreatedHandler {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @OnEvent('comment.created')
  public async handle(event: { postId: string; commentAuthorId: string; postAuthorId: string }) {
    // Don't notify if commenting on own post
    if (event.commentAuthorId === event.postAuthorId) return;

    const post = await this.postRepository.getPostById(event.postId);
    const commentAuthor = await this.userRepository.getUserById(event.commentAuthorId);
    if (!post || !commentAuthor) return;

    const postJson = post.toJSON();
    const authorJson = commentAuthor.toJSON();

    const notification = NotificationEntity.create(
      event.postAuthorId,
      'NEW_COMMENT',
      'New Comment',
      `${authorJson.username} commented on your post '${postJson.title}'`,
      `/posts/${postJson.slug || postJson.id}`,
      { postId: event.postId, authorId: event.commentAuthorId },
    );

    await this.notificationRepository.createNotification(notification);
  }
}
