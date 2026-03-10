import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreateTagDto } from '../../application/dtos/create-tag.dto';
import { UpdateTagDto } from '../../application/dtos/update-tag.dto';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case';
import { UpdateTagUseCase } from '../../application/use-cases/update-tag.use-case';
import { DeleteTagUseCase } from '../../application/use-cases/delete-tag.use-case';
import { ListTagsUseCase } from '../../application/use-cases/list-tags.use-case';
import { AddTagToPostUseCase } from '../../application/use-cases/add-tag-to-post.use-case';
import { RemoveTagFromPostUseCase } from '../../application/use-cases/remove-tag-from-post.use-case';

@Controller()
export class TagController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
    private readonly listTagsUseCase: ListTagsUseCase,
    private readonly addTagToPostUseCase: AddTagToPostUseCase,
    private readonly removeTagFromPostUseCase: RemoveTagFromPostUseCase,
  ) {}

  @Get('tags')
  public async listTags() {
    const tags = await this.listTagsUseCase.execute();
    return { tags: tags.map((t) => t.toJSON()) };
  }

  @Post('tags')
  @UseGuards(JwtAuthGuard)
  public async createTag(
    @Requester() user: UserEntity,
    @Body() input: CreateTagDto,
  ) {
    const tag = await this.createTagUseCase.execute(input, user);
    return tag.toJSON();
  }

  @Patch('tags/:id')
  @UseGuards(JwtAuthGuard)
  public async updateTag(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: UpdateTagDto,
  ) {
    const tag = await this.updateTagUseCase.execute(id, input, user);
    return tag.toJSON();
  }

  @Delete('tags/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  public async deleteTag(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    await this.deleteTagUseCase.execute(id, user);
  }

  @Post('posts/:postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  public async addTagToPost(
    @Requester() user: UserEntity,
    @Param('postId') postId: string,
    @Param('tagId') tagId: string,
  ) {
    const post = await this.addTagToPostUseCase.execute(postId, tagId, user);
    return post.toJSON();
  }

  @Delete('posts/:postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  public async removeTagFromPost(
    @Requester() user: UserEntity,
    @Param('postId') postId: string,
    @Param('tagId') tagId: string,
  ) {
    await this.removeTagFromPostUseCase.execute(postId, tagId, user);
  }
}