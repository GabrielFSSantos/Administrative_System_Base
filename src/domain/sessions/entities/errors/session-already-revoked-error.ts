import { DomainError } from '@/core/errors/domain-error'

export class SessionAlreadyRevokedError extends Error implements DomainError {
  constructor() {
    super('Session has already been revoked.')
  }
}
