import { UseCaseError } from '@/core/errors/use-case-error'

export class SessionExpiredError extends Error implements UseCaseError {
  constructor() {
    super('Session has already expired.')
  }
}
