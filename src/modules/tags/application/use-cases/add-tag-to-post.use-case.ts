import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { TagNotFoundException } from '../../domain/exceptions/tag-not-found.exception';
import { TagRepository } from '../../domain/repositories/tag.repository';

@Injectable()
export class AddTagToPostUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(postId: string, tagId: string): Promise<void> {
    const post = await this.postRepository.getPostById(postId);

    if (!post) {
      throw new Error('Post not found');
    }

    const tag = await this.tagRepository.findById(tagId);

    if (!tag) {
      throw new TagNotFoundException();
    }

    await this.tagRepository.addTagToPost(postId, tagId);
  }
}