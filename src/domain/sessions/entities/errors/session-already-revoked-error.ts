import { UseCaseError } from '@/core/errors/use-case-error'

export class SessionAlreadyRevokedError extends Error implements UseCaseError {
  constructor() {
    super('Session has already been revoked.')
  }
}
