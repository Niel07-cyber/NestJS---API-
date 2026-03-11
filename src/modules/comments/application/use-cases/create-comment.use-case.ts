import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { PostNotFoundException } from '../../../posts/domain/exceptions/post-not-found.exception';
import { PostNotAcceptedException } from '../../domain/exceptions/post-not-accepted.exception';
import { CreateCommentDto } from '../dtos/create-comment.dto';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(input: CreateCommentDto): Promise<CommentEntity> {
    const post = await this.postRepository.getPostById(input.postId);
    if (!post) throw new PostNotFoundException();
    if (post.status !== 'accepted') throw new PostNotAcceptedException();

    const comment = CommentEntity.create(input.content, input.postId, input.authorId);
    await this.commentRepository.createComment(comment);

    this.eventEmitter.emit('comment.created', {
      postId: input.postId,
      commentAuthorId: input.authorId,
      postAuthorId: post.authorId,
    });

    return comment;
  }
}
