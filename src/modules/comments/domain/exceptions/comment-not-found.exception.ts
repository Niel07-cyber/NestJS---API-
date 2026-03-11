import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class CommentNotFoundException extends DomainException {
  constructor() {
    super('Comment not found', 'COMMENT_NOT_FOUND');
  }
}
