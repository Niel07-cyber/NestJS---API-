import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { ForbiddenDomainException } from '../../../shared/errors/domain/exceptions/forbidden.exception';

@Injectable()
export class GetPostBySlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  public async execute(slug: string, user?: any): Promise<any> {
    const post = await this.postRepository.findBySlug(slug);
    if (!post) {
      throw new PostNotFoundException();
    }
    const json = post.toJSON();

    // Visibility rules
    if (json.status !== 'accepted') {
      if (!user) {
        throw new ForbiddenDomainException();
      }
      if (user.role !== 'admin' && user.role !== 'moderator' && json.authorId !== user.id) {
        throw new ForbiddenDomainException();
      }
    }

    return post;
  }
}