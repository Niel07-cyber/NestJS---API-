import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { PostNotFoundException } from '../../../posts/domain/exceptions/post-not-found.exception';
import { UserRepository } from '../../../users/domain/repositories/user.repository';

@Injectable()
export class GetCommentsUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(
    postId: string,
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'createdAt',
    order: string = 'desc',
  ): Promise<any> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) throw new PostNotFoundException();

    const { comments, total } = await this.commentRepository.getCommentsByPostId(
      postId, page, pageSize, sortBy, order,
    );

    const enriched = await Promise.all(
      comments.map(async (comment) => {
        const json = comment.toJSON();
        const author = await this.userRepository.getUserById(json.authorId as string);
        const authorJson = author?.toJSON();
        const { authorId, ...rest } = json as any;
        return {
          ...rest,
          author: authorJson ? { id: authorJson.id, username: authorJson.username } : null,
        };
      }),
    );

    return { comments: enriched, total, page, pageSize };
  }
}
