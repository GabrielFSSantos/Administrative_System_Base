import { UseCaseError } from '@/core/errors/use-case-error'

export class AlreadyActivatedError extends Error implements UseCaseError {
  constructor() {
    super('User is already active.')
  }
}
