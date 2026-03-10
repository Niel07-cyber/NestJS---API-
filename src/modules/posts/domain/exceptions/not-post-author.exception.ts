import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class NotPostAuthorException extends DomainException {
  constructor() {
    super('You are not the author of this post', 'NOT_POST_AUTHOR');
  }
}