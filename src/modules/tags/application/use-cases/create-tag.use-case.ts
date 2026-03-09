import { Injectable } from '@nestjs/common';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagAlreadyExistsException } from '../../domain/exceptions/tag-already-exists.exception';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Injectable()
export class CreateTagUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  public async execute(input: CreateTagDto): Promise<TagEntity> {
    const existing = await this.tagRepository.findByName(input.name);

    if (existing) {
      throw new TagAlreadyExistsException();
    }

    const tag = TagEntity.create(input.name);
    await this.tagRepository.createTag(tag);

    return tag;
  }
}