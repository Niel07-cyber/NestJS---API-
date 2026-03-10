import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class GetPostsUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

 public async execute(tags?: string[]): Promise<PostEntity[]> {
  this.loggingService.log('GetPostsUseCase.execute');
  if (tags && tags.length > 0) {
    return this.postRepository.getPostsByTags(tags);
  }
  return this.postRepository.getPosts();
}
}
