import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidEmailAddressError extends Error implements UseCaseError {
  constructor() {
    super('Provided email address is invalid.')
  }
}
