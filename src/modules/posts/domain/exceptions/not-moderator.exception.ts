import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class NotModeratorException extends DomainException {
  constructor() {
    super('Only moderators can perform this action', 'NOT_MODERATOR');
  }
}