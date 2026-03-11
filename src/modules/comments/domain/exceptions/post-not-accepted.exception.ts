import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class PostNotAcceptedException extends DomainException {
  constructor() {
    super('Post is not accepted', 'POST_NOT_ACCEPTED');
  }
}
