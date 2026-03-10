import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class PostNotFoundException extends DomainException {
  constructor() {
    super('Post not found', 'POST_NOT_FOUND');
  }
}