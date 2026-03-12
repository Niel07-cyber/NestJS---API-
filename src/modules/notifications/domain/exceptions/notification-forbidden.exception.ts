import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class NotificationForbiddenException extends DomainException {
  constructor() {
    super('You do not have permission to access this notification', 'NOTIFICATION_FORBIDDEN');
  }
}
