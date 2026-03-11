import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostCreatedEvent } from '../../domain/events/post-created.event';
import { UserCannotCreatePostException } from '../../domain/exceptions/user-cannot-create-post.exception';
import { PostRepository } from '../../domain/repositories/post.repository';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostSlug } from '../../domain/value-objects/post-slug.value-object';
import { InvalidSlugException } from '../../domain/exceptions/invalid-slug.exception';
import { SlugAlreadyExistsException } from '../../domain/exceptions/slug-already-exists.exception';

@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(input: CreatePostDto, user: UserEntity): Promise<void> {
    if (!user.permissions.posts.canCreate()) {
      throw new UserCannotCreatePostException();
    }

    
    let slug: string;
    if (input.slug) {
     
      if (!PostSlug.validate(input.slug)) {
        throw new InvalidSlugException();
      }
      const existing = await this.postRepository.findBySlug(input.slug);
      if (existing) {
        throw new SlugAlreadyExistsException();
      }
      slug = input.slug;
    } else {

      slug = PostSlug.generate(input.title);
     
      let candidate = slug;
      let counter = 2;
      while (await this.postRepository.findBySlug(candidate)) {
        candidate = `${slug}-${counter}`;
        counter++;
      }
      slug = candidate;
    }

    const post = PostEntity.create(input.title, input.content, input.authorId, slug);
    await this.postRepository.createPost(post);
    this.eventEmitter.emit(PostCreatedEvent, {
      postId: post.id,
      authorId: input.authorId,
    });
  }
}