import { DomainError } from '@/core/errors/domain-error'

export class WeakPasswordError extends Error implements DomainError {
  constructor() {
    super('Password is too weak. It must contain at least 6 characters, one uppercase letter, one number and one special character.')
  }
}
