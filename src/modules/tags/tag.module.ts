import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { PostModule } from '../posts/post.module';
import { TagRepository } from './domain/repositories/tag.repository';
import { SQLiteTagRepository } from './infrastructure/repositories/tag.sqlite.repository';
import { TagController } from './infrastructure/controllers/tag.controller';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { UpdateTagUseCase } from './application/use-cases/update-tag.use-case';
import { DeleteTagUseCase } from './application/use-cases/delete-tag.use-case';
import { ListTagsUseCase } from './application/use-cases/list-tags.use-case';
import { AddTagToPostUseCase } from './application/use-cases/add-tag-to-post.use-case';
import { RemoveTagFromPostUseCase } from './application/use-cases/remove-tag-from-post.use-case';

@Module({
  imports: [AuthModule, PostModule],
  controllers: [TagController],
  providers: [
    {
      provide: TagRepository,
      useClass: SQLiteTagRepository,
    },
    CreateTagUseCase,
    UpdateTagUseCase,
    DeleteTagUseCase,
    ListTagsUseCase,
    AddTagToPostUseCase,
    RemoveTagFromPostUseCase,
  ],
})
export class TagModule {}