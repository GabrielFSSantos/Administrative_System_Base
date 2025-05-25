import { DomainError } from '@/core/errors/domain-error'

export class InvalidPasswordHashError extends Error implements DomainError {
  constructor() {
    super('Provided password hash is invalid.')
  }
}
