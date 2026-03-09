import { Injectable } from '@nestjs/common';
import { TagNotFoundException } from '../../domain/exceptions/tag-not-found.exception';
import { TagRepository } from '../../domain/repositories/tag.repository';

@Injectable()
export class DeleteTagUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  public async execute(id: string): Promise<void> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new TagNotFoundException();
    }

    await this.tagRepository.deleteTag(id);
  }
}