import { DomainException } from './domain.exception';

export class ForbiddenDomainException extends DomainException {
  constructor() {
    super('Forbidden', 'FORBIDDEN');
  }
}