import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { CommentNotFoundException } from '../../domain/exceptions/comment-not-found.exception';
import { CannotDeleteCommentException } from '../../domain/exceptions/cannot-delete-comment.exception';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(commentId: string, user: UserEntity): Promise<void> {
    const comment = await this.commentRepository.getCommentById(commentId);
    if (!comment) throw new CommentNotFoundException();

    const userJson = user.toJSON();
    const post = await this.postRepository.getPostById(comment.postId);

    const isCommentAuthor = comment.authorId === userJson.id;
    const isPostAuthor = post?.authorId === userJson.id;
    const isModeratorOrAdmin = userJson.role === 'moderator' || userJson.role === 'admin';

    if (!isCommentAuthor && !isPostAuthor && !isModeratorOrAdmin) {
      throw new CannotDeleteCommentException();
    }

    await this.commentRepository.deleteComment(commentId);
  }
}
