import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { NotModeratorException } from '../../domain/exceptions/not-moderator.exception';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class RejectPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  public async execute(postId: string, user: UserEntity): Promise<void> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new PostNotFoundException();
    }
    const userJson = user.toJSON();
    if (userJson.role !== 'moderator' && userJson.role !== 'admin') {
      throw new NotModeratorException();
    }
    post.reject();
    await this.postRepository.updatePost(postId, post);
  }
}