import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class InvalidSlugException extends DomainException {
  constructor() {
    super('Invalid slug format', 'INVALID_SLUG');
  }
}