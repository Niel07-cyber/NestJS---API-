import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class SlugAlreadyExistsException extends DomainException {
  constructor() {
    super('Slug already exists', 'SLUG_ALREADY_EXISTS');
  }
}