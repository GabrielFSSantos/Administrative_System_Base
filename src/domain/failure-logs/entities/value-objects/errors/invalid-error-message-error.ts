import { DomainError } from '@/core/errors/domain-error'

export class InvalidErrorMessageError extends Error implements DomainError {
  constructor() {
    super('Error message cannot be empty.')
  }
}
