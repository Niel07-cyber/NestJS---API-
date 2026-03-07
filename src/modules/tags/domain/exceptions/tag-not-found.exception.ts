import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class TagNotFoundException extends DomainException {
  constructor() {
    super('Tag not found', 'TAG_NOT_FOUND');
  }
}