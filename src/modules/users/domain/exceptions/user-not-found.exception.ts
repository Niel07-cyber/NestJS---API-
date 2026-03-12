import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserNotFoundException extends DomainException {
  constructor() {
    super('User not found', 'USER_NOT_FOUND');
  }
}
