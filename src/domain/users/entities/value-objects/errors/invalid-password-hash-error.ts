import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidPasswordHashError extends Error implements UseCaseError {
  constructor() {
    super('Provided password hash is invalid.')
  }
}
