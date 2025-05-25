import { DomainError } from '@/core/errors/domain-error'

export class InvalidEmailAddressError extends Error implements DomainError {
  constructor() {
    super('Provided email address is invalid.')
  }
}
