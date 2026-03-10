import { Injectable } from '@nestjs/common';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagAlreadyExistsException } from '../../domain/exceptions/tag-already-exists.exception';
import { TagNotFoundException } from '../../domain/exceptions/tag-not-found.exception';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { UpdateTagDto } from '../dtos/update-tag.dto';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { ForbiddenDomainException } from '../../../shared/errors/domain/exceptions/forbidden.exception';

@Injectable()
export class UpdateTagUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  public async execute(id: string, input: UpdateTagDto, user: UserEntity): Promise<TagEntity> {
    if (user.toJSON().role !== 'admin') {
      throw new ForbiddenDomainException();
    }
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new TagNotFoundException();
    }
    const existing = await this.tagRepository.findByName(input.name);
    if (existing && existing.id !== id) {
      throw new TagAlreadyExistsException();
    }
    tag.update(input.name);
    await this.tagRepository.updateTag(id, tag);
    return tag;
  }
}