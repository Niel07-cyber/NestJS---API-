import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';

@Injectable()
export class GetPostsUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(tags?: string[], user?: any): Promise<any> {
    this.loggingService.log('GetPostsUseCase.execute');

    let posts: PostEntity[];

    if (tags && tags.length > 0) {
      posts = await this.postRepository.getPostsByTags(tags);
    } else {
      posts = await this.postRepository.getPosts();
    }

    if (!user) {
      posts = posts.filter(p => p.toJSON().status === 'accepted');
    } else if (user.role === 'moderator' || user.role === 'admin') {
      
    } else {
      posts = posts.filter(p => {
        const json = p.toJSON();
        return json.status === 'accepted' || json.authorId === user.id;
      });
    }

    
    const postsWithAuthor = await Promise.all(
      posts.map(async (post) => {
        const json = post.toJSON();
        const author = await this.userRepository.getUserById(json.authorId as string);
        const authorJson = author?.toJSON();
        const { authorId, ...postWithoutAuthorId } = json as any;
        return {
          ...postWithoutAuthorId,
          author: authorJson ? { id: authorJson.id, username: authorJson.username } : null,
        };
      })
    );

    return {
      posts: postsWithAuthor,
      total: postsWithAuthor.length,
      page: 1,
      pageSize: 20,
    };
  }
}