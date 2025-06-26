import { DomainError } from '@/core/errors/domain-error'

export class InvalidSessionDateExpiredError extends Error implements DomainError {
  constructor() {
    super('Expiration date cannot be before creation date.')
  }
}
