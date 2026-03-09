import { Injectable } from '@nestjs/common';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';

@Injectable()
export class ListTagsUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  public async execute(): Promise<TagEntity[]> {
    return this.tagRepository.findAll();
  }
}