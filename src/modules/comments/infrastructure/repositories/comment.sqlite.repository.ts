import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { SQLiteCommentEntity } from '../entities/comment.sqlite.entity';

@Injectable()
export class SQLiteCommentRepository extends CommentRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  public async createComment(comment: CommentEntity): Promise<void> {
    const json = comment.toJSON();
    await this.dataSource.getRepository(SQLiteCommentEntity).save(json);
  }

  public async getCommentById(id: string): Promise<CommentEntity | undefined> {
    const comment = await this.dataSource
      .getRepository(SQLiteCommentEntity)
      .findOne({ where: { id } });
    return comment ? CommentEntity.reconstitute({ ...comment }) : undefined;
  }

  public async getCommentsByPostId(
    postId: string,
    page: number,
    pageSize: number,
    sortBy: string,
    order: string,
  ): Promise<{ comments: CommentEntity[]; total: number }> {
    const [results, total] = await this.dataSource
      .getRepository(SQLiteCommentEntity)
      .findAndCount({
        where: { postId },
        order: { [sortBy]: order.toUpperCase() },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    return {
      comments: results.map((c) => CommentEntity.reconstitute({ ...c })),
      total,
    };
  }

  public async updateComment(id: string, comment: CommentEntity): Promise<void> {
    const json = comment.toJSON();
    await this.dataSource.getRepository(SQLiteCommentEntity).save(json);
  }

  public async deleteComment(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteCommentEntity).delete(id);
  }

  public async getCommentCountByPostId(postId: string): Promise<number> {
    return this.dataSource
      .getRepository(SQLiteCommentEntity)
      .count({ where: { postId } });
  }
}
