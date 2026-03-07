import { TagEntity } from '../../../tags/domain/entities/tag.entity';

export abstract class TagRepository {
  public abstract findAll(): Promise<TagEntity[]>;
  public abstract findById(id: string): Promise<TagEntity | undefined>;
  public abstract findByName(name: string): Promise<TagEntity | undefined>;
  public abstract createTag(tag: TagEntity): Promise<void>;
  public abstract updateTag(id: string, tag: TagEntity): Promise<void>;
  public abstract deleteTag(id: string): Promise<void>;
}