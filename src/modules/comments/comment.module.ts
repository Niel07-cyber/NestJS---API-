import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { UserModule } from '../users/user.module';
import { PostModule } from '../posts/post.module';
import { CommentRepository } from './domain/repositories/comment.repository';
import { SQLiteCommentRepository } from './infrastructure/repositories/comment.sqlite.repository';
import { CommentController } from './infrastructure/controllers/comment.controller';
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { GetCommentsUseCase } from './application/use-cases/get-comments.use-case';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.use-case';
import { GetCommentCountUseCase } from './application/use-cases/get-comment-count.use-case';

@Module({
  imports: [AuthModule, UserModule, PostModule],
  controllers: [CommentController],
  providers: [
    {
      provide: CommentRepository,
      useClass: SQLiteCommentRepository,
    },
    CreateCommentUseCase,
    GetCommentsUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    GetCommentCountUseCase,
  ],
})
export class CommentModule {}
