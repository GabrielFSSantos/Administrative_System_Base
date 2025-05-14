import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidSessionDateExpiredError extends Error implements UseCaseError {
  constructor() {
    super('Expiration date cannot be before creation date.')
  }
}
