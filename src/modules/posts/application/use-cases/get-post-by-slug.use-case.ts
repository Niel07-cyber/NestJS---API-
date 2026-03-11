import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { ForbiddenDomainException } from '../../../shared/errors/domain/exceptions/forbidden.exception';
import { UserRepository } from '../../../users/domain/repositories/user.repository';

@Injectable()
export class GetPostBySlugUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

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

    // Build author object
    const author = await this.userRepository.getUserById(json.authorId as string);
    const authorJson = author?.toJSON();
    const { authorId, ...postWithoutAuthorId } = json as any;

    return {
      ...postWithoutAuthorId,
      author: authorJson ? { id: authorJson.id, username: authorJson.username } : null,
    };
  }
}