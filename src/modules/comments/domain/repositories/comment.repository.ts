import { CommentEntity } from '../entities/comment.entity';

export abstract class CommentRepository {
  public abstract createComment(comment: CommentEntity): Promise<void>;
  public abstract getCommentById(id: string): Promise<CommentEntity | undefined>;
  public abstract getCommentsByPostId(
    postId: string,
    page: number,
    pageSize: number,
    sortBy: string,
    order: string,
  ): Promise<{ comments: CommentEntity[]; total: number }>;
  public abstract updateComment(id: string, comment: CommentEntity): Promise<void>;
  public abstract deleteComment(id: string): Promise<void>;
  public abstract getCommentCountByPostId(postId: string): Promise<number>;
}
