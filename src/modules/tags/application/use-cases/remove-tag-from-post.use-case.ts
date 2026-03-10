import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { TagNotFoundException } from '../../domain/exceptions/tag-not-found.exception';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostNotFoundException } from '../../../posts/domain/exceptions/post-not-found.exception';
import { ForbiddenDomainException } from '../../../shared/errors/domain/exceptions/forbidden.exception';

@Injectable()
export class RemoveTagFromPostUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(postId: string, tagId: string, user: UserEntity): Promise<void> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new PostNotFoundException();
    }
    const userJson = user.toJSON();
    if (userJson.role !== 'admin' && post.authorId !== userJson.id) {
      throw new ForbiddenDomainException();
    }
    const tag = await this.tagRepository.findById(tagId);
    if (!tag) {
      throw new TagNotFoundException();
    }
    await this.tagRepository.removeTagFromPost(postId, tagId);
  }
}