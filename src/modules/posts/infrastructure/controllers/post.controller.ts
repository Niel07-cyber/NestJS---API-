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
  public async getPosts(
    @Requester() user: UserEntity,
    @Query('tags') tagsParam?: string,
  ) {
    const tags = tagsParam ? tagsParam.split(',') : undefined;
    return this.getPostsUseCase.execute(tags, user?.toJSON());
  }
@Get(':idOrSlug')
@UseGuards(JwtAuthOptionalGuard)
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
  public async createPost(
    @Requester() user: UserEntity,
    @Body() input: Omit<CreatePostDto, 'authorId'>,
  ) {
    return this.createPostUseCase.execute(
      { ...input, authorId: user.id },
      user,
    );
  }

  @Patch(':id/slug')
  @UseGuards(JwtAuthGuard)
  public async updatePostSlug(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() body: { slug: string },
  ) {
    const post = await this.updatePostSlugUseCase.execute(id, body.slug, user);
    return post.toJSON();
  }

  @Patch(':id')
  public async updatePost(
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ) {
    return this.updatePostUseCase.execute(id, input);
  }

  @Delete(':id')
@UseGuards(JwtAuthGuard)
public async deletePost(
  @Requester() user: UserEntity,
  @Param('id') id: string,
) {
  return this.deletePostUseCase.execute(id, user);
}
  @Post(':id/submit-for-review')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  public async submitForReview(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    await this.submitPostForReviewUseCase.execute(id, user);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  public async approvePost(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    await this.approvePostUseCase.execute(id, user);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  public async rejectPost(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    await this.rejectPostUseCase.execute(id, user);
  }
}