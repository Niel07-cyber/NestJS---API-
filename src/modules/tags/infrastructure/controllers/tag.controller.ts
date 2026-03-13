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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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

@ApiTags('Tags')
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
  @ApiOperation({ summary: 'List all tags' })
  @ApiResponse({ status: 200, description: 'Returns all tags' })
  public async listTags() {
    const tags = await this.listTagsUseCase.execute();
    return { tags: tags.map((t) => t.toJSON()) };
  }

  @Post('tags')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a tag (admin only)' })
  @ApiResponse({ status: 201, description: 'Tag created' })
  @ApiResponse({ status: 409, description: 'Tag already exists' })
  public async createTag(
    @Requester() user: UserEntity,
    @Body() input: CreateTagDto,
  ) {
    const tag = await this.createTagUseCase.execute(input, user);
    return tag.toJSON();
  }

  @Patch('tags/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a tag (admin only)' })
  @ApiResponse({ status: 200, description: 'Tag updated' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
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
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a tag (admin only)' })
  @ApiResponse({ status: 204, description: 'Tag deleted' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  public async deleteTag(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    await this.deleteTagUseCase.execute(id, user);
  }

  @Post('posts/:postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Add tag to post (author or admin)' })
  @ApiResponse({ status: 200, description: 'Tag added to post' })
  @ApiResponse({ status: 409, description: 'Tag already associated' })
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
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove tag from post (author or admin)' })
  @ApiResponse({ status: 204, description: 'Tag removed from post' })
  public async removeTagFromPost(
    @Requester() user: UserEntity,
    @Param('postId') postId: string,
    @Param('tagId') tagId: string,
  ) {
    await this.removeTagFromPostUseCase.execute(postId, tagId, user);
  }
}
