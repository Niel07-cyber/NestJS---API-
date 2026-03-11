import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class InvalidTagNameException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_TAG_NAME');
  }
}