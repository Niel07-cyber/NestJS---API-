import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class TagAlreadyAssociatedException extends DomainException {
  constructor() {
    super('Tag already associated with this post', 'TAG_ALREADY_ASSOCIATED');
  }
}