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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getPostById(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    const post = await this.getPostByIdUseCase.execute(id, user);
    return post?.toJSON();
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

  @Patch(':id')
  public async updatePost(
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ) {
    return this.updatePostUseCase.execute(id, input);
  }

  @Delete(':id')
  public async deletePost(@Param('id') id: string) {
    return this.deletePostUseCase.execute(id);
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