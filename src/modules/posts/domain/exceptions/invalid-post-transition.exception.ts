import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class InvalidPostTransitionException extends DomainException {
  constructor() {
    super('Invalid post status transition', 'INVALID_POST_TRANSITION');
  }
}