import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class NotificationNotFoundException extends DomainException {
  constructor() {
    super('Notification not found', 'NOTIFICATION_NOT_FOUND');
  }
}
