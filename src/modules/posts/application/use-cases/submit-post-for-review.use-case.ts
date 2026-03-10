import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { NotPostAuthorException } from '../../domain/exceptions/not-post-author.exception';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class SubmitPostForReviewUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  public async execute(postId: string, user: UserEntity): Promise<void> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new PostNotFoundException();
    }
    const userJson = user.toJSON();
    if (post.authorId !== userJson.id) {
      throw new NotPostAuthorException();
    }
    post.submitForReview();
    await this.postRepository.updatePost(postId, post);
  }
}