import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class TagAlreadyExistsException extends DomainException {
  constructor() {
    super('Tag with this name already exists', 'TAG_ALREADY_EXISTS');
  }
}