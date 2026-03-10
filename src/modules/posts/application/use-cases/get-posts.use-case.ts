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

  public async execute(tags?: string[], user?: any): Promise<PostEntity[]> {
    this.loggingService.log('GetPostsUseCase.execute');
    
    let posts: PostEntity[];
    
    if (tags && tags.length > 0) {
      posts = await this.postRepository.getPostsByTags(tags);
    } else {
      posts = await this.postRepository.getPosts();
    }

   
    if (!user) {
      
      return posts.filter(p => p.toJSON().status === 'accepted');
    }

    const role = user.role;
    const userId = user.id;

    if (role === 'moderator' || role === 'admin') {
     
      return posts;
    }

   
    return posts.filter(p => {
      const json = p.toJSON();
      return json.status === 'accepted' || json.authorId === userId;
    });
  }
}