import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { ForbiddenDomainException } from '../../../shared/errors/domain/exceptions/forbidden.exception';
import { SlugAlreadyExistsException } from '../../domain/exceptions/slug-already-exists.exception';
import { InvalidSlugException } from '../../domain/exceptions/invalid-slug.exception';
import { PostSlug } from '../../domain/value-objects/post-slug.value-object';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class UpdatePostSlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  public async execute(postId: string, slug: string, user: UserEntity): Promise<any> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new PostNotFoundException();
    }
    const userJson = user.toJSON();
    if (userJson.role !== 'admin' && post.authorId !== userJson.id) {
      throw new ForbiddenDomainException();
    }
    if (!PostSlug.validate(slug)) {
      throw new InvalidSlugException();
    }
    const existing = await this.postRepository.findBySlug(slug);
    if (existing && existing.id !== postId) {
      throw new SlugAlreadyExistsException();
    }
    post.updateSlug(slug);
    await this.postRepository.updatePost(postId, post);
    return post;
  }
}