import { DomainError } from '@/core/errors/domain-error'

export class AlreadyDeactivatedError extends Error implements DomainError {
  constructor() {
    super('User is already inactive.')
  }
}
