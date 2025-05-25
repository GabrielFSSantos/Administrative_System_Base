import { DomainError } from '@/core/errors/domain-error'

export class SessionExpiredError extends Error implements DomainError {
  constructor() {
    super('Session has already expired.')
  }
}
