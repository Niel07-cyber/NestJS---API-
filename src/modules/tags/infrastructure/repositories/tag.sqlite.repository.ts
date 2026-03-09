import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { SQLiteTagEntity } from '../entities/tag.sqlite.entity';

@Injectable()
export class SQLiteTagRepository implements TagRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async findAll(): Promise<TagEntity[]> {
    const tags = await this.dataSource.getRepository(SQLiteTagEntity).find();
    return tags.map((tag) => TagEntity.reconstitute({ ...tag }));
  }

  public async findById(id: string): Promise<TagEntity | undefined> {
    const tag = await this.dataSource
      .getRepository(SQLiteTagEntity)
      .findOne({ where: { id } });
    return tag ? TagEntity.reconstitute({ ...tag }) : undefined;
  }

  public async findByName(name: string): Promise<TagEntity | undefined> {
    const tag = await this.dataSource
      .getRepository(SQLiteTagEntity)
      .findOne({ where: { name: name.toLowerCase() } });
    return tag ? TagEntity.reconstitute({ ...tag }) : undefined;
  }

  public async createTag(tag: TagEntity): Promise<void> {
    await this.dataSource.getRepository(SQLiteTagEntity).save(tag.toJSON());
  }

  public async updateTag(id: string, tag: TagEntity): Promise<void> {
    await this.dataSource
      .getRepository(SQLiteTagEntity)
      .update(id, { name: tag.name });
  }

  public async deleteTag(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteTagEntity).delete(id);
  }

  public async addTagToPost(postId: string, tagId: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .relation(SQLiteTagEntity, 'posts')
      .of(tagId)
      .add(postId);
  }

  public async removeTagFromPost(postId: string, tagId: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .relation(SQLiteTagEntity, 'posts')
      .of(tagId)
      .remove(postId);
  }
}