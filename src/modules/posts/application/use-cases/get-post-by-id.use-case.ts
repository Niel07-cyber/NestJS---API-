import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';

@Injectable()
export class GetPostByIdUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<any> {
    this.loggingService.log('GetPostByIdUseCase.execute');
    const post = await this.postRepository.getPostById(id);
    if (!post) return;
    if (!user.permissions.posts.canReadPost(post)) {
      throw new Error('Cannot read this post');
    }
    const json = post.toJSON();
    const author = await this.userRepository.getUserById(json.authorId as string);
    const authorJson = author?.toJSON();
    const { authorId, ...postWithoutAuthorId } = json as any;
    return {
      ...postWithoutAuthorId,
      author: authorJson ? { id: authorJson.id, username: authorJson.username } : null,
    };
  }
}