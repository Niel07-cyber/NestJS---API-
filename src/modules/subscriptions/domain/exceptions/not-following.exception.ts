import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class NotFollowingException extends DomainException {
  constructor() {
    super('Not following this user', 'NOT_FOLLOWING');
  }
}
