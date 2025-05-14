import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidNameError extends Error implements UseCaseError {
  constructor() {
    super('Provided name is invalid.')
  }
}
