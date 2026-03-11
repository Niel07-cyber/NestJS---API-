import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class InvalidCommentContentException extends DomainException {
  constructor() {
    super('Invalid comment content', 'INVALID_COMMENT_CONTENT');
  }
}
