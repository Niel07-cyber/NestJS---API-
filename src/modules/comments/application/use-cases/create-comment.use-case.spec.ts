import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { CreateCommentUseCase } from './create-comment.use-case';
import { PostNotFoundException } from '../../../posts/domain/exceptions/post-not-found.exception';
import { PostNotAcceptedException } from '../../domain/exceptions/post-not-accepted.exception';

const makePost = (status: string) => ({
  id: 'post-uuid',
  status,
  authorId: 'author-uuid',
  toJSON: () => ({ id: 'post-uuid', status, authorId: 'author-uuid' }),
});

describe('CreateCommentUseCase', () => {
  let useCase: CreateCommentUseCase;
  let commentRepository: jest.Mocked<CommentRepository>;
  let postRepository: jest.Mocked<PostRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(() => {
    commentRepository = {
      createComment: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<CommentRepository>;

    postRepository = {
      getPostById: jest.fn(),
    } as unknown as jest.Mocked<PostRepository>;

    eventEmitter = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<EventEmitter2>;

    useCase = new CreateCommentUseCase(commentRepository, postRepository, eventEmitter);
  });

  it('should create a comment on an accepted post', async () => {
    postRepository.getPostById.mockResolvedValue(makePost('accepted') as any);
    const result = await useCase.execute({
      content: 'Great post!',
      postId: 'post-uuid',
      authorId: 'user-uuid',
    });
    expect(commentRepository.createComment).toHaveBeenCalledTimes(1);
    expect(eventEmitter.emit).toHaveBeenCalledWith('comment.created', expect.objectContaining({
      postId: 'post-uuid',
      commentAuthorId: 'user-uuid',
    }));
    expect(result.toJSON().content).toBe('Great post!');
  });

  it('should throw PostNotFoundException when post does not exist', async () => {
    postRepository.getPostById.mockResolvedValue(null);
    await expect(useCase.execute({
      content: 'Great post!',
      postId: 'non-existent',
      authorId: 'user-uuid',
    })).rejects.toThrow(PostNotFoundException);
    expect(commentRepository.createComment).not.toHaveBeenCalled();
  });

  it('should throw PostNotAcceptedException when post is not accepted', async () => {
    postRepository.getPostById.mockResolvedValue(makePost('draft') as any);
    await expect(useCase.execute({
      content: 'Great post!',
      postId: 'post-uuid',
      authorId: 'user-uuid',
    })).rejects.toThrow(PostNotAcceptedException);
    expect(commentRepository.createComment).not.toHaveBeenCalled();
  });
});
