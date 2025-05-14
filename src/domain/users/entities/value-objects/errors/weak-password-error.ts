import { UseCaseError } from '@/core/errors/use-case-error'

export class WeakPasswordError extends Error implements UseCaseError {
  constructor() {
    super('Password is too weak. It must contain at least 6 characters, one uppercase letter, one number and one special character.')
  }
}
