import { Injectable } from '@nestjs/common';
import { TagNotFoundException } from '../../domain/exceptions/tag-not-found.exception';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { ForbiddenDomainException } from '../../../shared/errors/domain/exceptions/forbidden.exception';

@Injectable()
export class DeleteTagUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  public async execute(id: string, user: UserEntity): Promise<void> {
    if (user.toJSON().role !== 'admin') {
      throw new ForbiddenDomainException();
    }
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new TagNotFoundException();
    }
    await this.tagRepository.removeAllPostAssociations(id);
    await this.tagRepository.deleteTag(id);
  }
}