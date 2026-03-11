import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { PostNotFoundException } from '../../../posts/domain/exceptions/post-not-found.exception';

@Injectable()
export class GetCommentCountUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(postId: string): Promise<{ postId: string; count: number }> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) throw new PostNotFoundException();

    const count = await this.commentRepository.getCommentCountByPostId(postId);
    return { postId, count };
  }
}
