import { DomainError } from '@/core/errors/domain-error'

export class InvalidFailureContextError extends Error implements DomainError {
  constructor() {
    super('FailureContext cannot be empty.')
  }
}
