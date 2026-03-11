import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreateCommentUseCase } from '../../application/use-cases/create-comment.use-case';
import { GetCommentsUseCase } from '../../application/use-cases/get-comments.use-case';
import { UpdateCommentUseCase } from '../../application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from '../../application/use-cases/delete-comment.use-case';
import { GetCommentCountUseCase } from '../../application/use-cases/get-comment-count.use-case';

@Controller()
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly getCommentsUseCase: GetCommentsUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly getCommentCountUseCase: GetCommentCountUseCase,
  ) {}

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  public async createComment(
    @Requester() user: UserEntity,
    @Param('postId') postId: string,
    @Body() body: { content: string },
  ) {
    const comment = await this.createCommentUseCase.execute({
      content: body.content,
      postId,
      authorId: user.id,
    });
    const json = comment.toJSON();
    const { authorId, ...rest } = json as any;
    return { ...rest, author: { id: user.id, username: (user.toJSON() as any).username } };
  }

  @Get('posts/:postId/comments/count')
  public async getCommentCount(@Param('postId') postId: string) {
    return this.getCommentCountUseCase.execute(postId);
  }

  @Get('posts/:postId/comments')
  public async getComments(
    @Param('postId') postId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
  ) {
    return this.getCommentsUseCase.execute(
      postId,
      page ? parseInt(page) : 1,
      pageSize ? Math.min(parseInt(pageSize), 100) : 20,
      sortBy ?? 'createdAt',
      order ?? 'desc',
    );
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard)
  public async updateComment(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    return this.updateCommentUseCase.execute(id, body.content, user);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  public async deleteComment(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    await this.deleteCommentUseCase.execute(id, user);
  }
}
