import { UseCaseError } from '@/core/errors/use-case-error'

export class AlreadyDeactivatedError extends Error implements UseCaseError {
  constructor() {
    super('User is already inactive.')
  }
}
