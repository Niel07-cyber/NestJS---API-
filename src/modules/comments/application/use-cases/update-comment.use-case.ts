import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentNotFoundException } from '../../domain/exceptions/comment-not-found.exception';
import { ForbiddenDomainException } from '../../../shared/errors/domain/exceptions/forbidden.exception';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { UserRepository } from '../../../users/domain/repositories/user.repository';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(commentId: string, content: string, user: UserEntity): Promise<any> {
    const comment = await this.commentRepository.getCommentById(commentId);
    if (!comment) throw new CommentNotFoundException();

    const userJson = user.toJSON();
    if (comment.authorId !== userJson.id) throw new ForbiddenDomainException();

    comment.update(content);
    await this.commentRepository.updateComment(commentId, comment);

    const json = comment.toJSON();
    const author = await this.userRepository.getUserById(json.authorId as string);
    const authorJson = author?.toJSON();
    const { authorId, ...rest } = json as any;
    return {
      ...rest,
      author: authorJson ? { id: authorJson.id, username: authorJson.username } : null,
    };
  }
}
