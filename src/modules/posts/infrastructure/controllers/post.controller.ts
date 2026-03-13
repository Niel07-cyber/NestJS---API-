import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { JwtAuthOptionalGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth-optional.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreatePostDto } from '../../application/dtos/create-post.dto';
import { UpdatePostDto } from '../../application/dtos/update-post.dto';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from '../../application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from '../../application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from '../../application/use-cases/update-post.use-case';
import { SubmitPostForReviewUseCase } from '../../application/use-cases/submit-post-for-review.use-case';
import { ApprovePostUseCase } from '../../application/use-cases/approve-post.use-case';
import { RejectPostUseCase } from '../../application/use-cases/reject-post.use-case';
import { GetPostBySlugUseCase } from '../../application/use-cases/get-post-by-slug.use-case';
import { UpdatePostSlugUseCase } from '../../application/use-cases/update-post-slug.use-case';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly submitPostForReviewUseCase: SubmitPostForReviewUseCase,
    private readonly approvePostUseCase: ApprovePostUseCase,
    private readonly rejectPostUseCase: RejectPostUseCase,
    private readonly getPostBySlugUseCase: GetPostBySlugUseCase,
    private readonly updatePostSlugUseCase: UpdatePostSlugUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthOptionalGuard)
  @ApiOperation({ summary: 'List all posts (filter by tags)' })
  @ApiQuery({ name: 'tags', required: false, description: 'Comma-separated tag names' })
  @ApiResponse({ status: 200, description: 'Returns paginated posts' })
  public async getPosts(
    @Requester() user: UserEntity,
    @Query('tags') tagsParam?: string,
  ) {
    const tags = tagsParam ? tagsParam.split(',') : undefined;
    return this.getPostsUseCase.execute(tags, user?.toJSON());
  }

  @Get(':idOrSlug')
  @UseGuards(JwtAuthOptionalGuard)
  @ApiOperation({ summary: 'Get post by ID or slug' })
  @ApiResponse({ status: 200, description: 'Returns the post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  public async getPost(
    @Requester() user: UserEntity,
    @Param('idOrSlug') idOrSlug: string,
  ) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(idOrSlug);
    if (isUuid) {
      return this.getPostByIdUseCase.execute(idOrSlug, user);
    } else {
      return this.getPostBySlugUseCase.execute(idOrSlug, user?.toJSON());
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async createPost(
    @Requester() user: UserEntity,
    @Body() input: Omit<CreatePostDto, 'authorId'>,
  ) {
    const post = await this.createPostUseCase.execute(
      { ...input, authorId: user.id },
      user,
    );
    return { ...post.toJSON(), author: { id: user.id, username: (user.toJSON() as any).username } };
  }

  @Patch(':id/slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post slug manually' })
  @ApiResponse({ status: 200, description: 'Slug updated' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  public async updatePostSlug(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() body: { slug: string },
  ) {
    const post = await this.updatePostSlugUseCase.execute(id, body.slug, user);
    return post.toJSON();
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post content' })
  @ApiResponse({ status: 200, description: 'Post updated' })
  public async updatePost(
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ) {
    return this.updatePostUseCase.execute(id, input);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted' })
  public async deletePost(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    return this.deletePostUseCase.execute(id, user);
  }

  @Post(':id/submit-for-review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Submit post for review' })
  @ApiResponse({ status: 200, description: 'Post submitted for review' })
  public async submitForReview(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    await this.submitPostForReviewUseCase.execute(id, user);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Approve a post (moderator only)' })
  @ApiResponse({ status: 200, description: 'Post approved' })
  public async approvePost(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    await this.approvePostUseCase.execute(id, user);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Reject a post (moderator only)' })
  @ApiResponse({ status: 200, description: 'Post rejected' })
  public async rejectPost(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    await this.rejectPostUseCase.execute(id, user);
  }
}
