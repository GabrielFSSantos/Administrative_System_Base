import { DomainError } from '@/core/errors/domain-error'

export class WrongCredentialsError extends Error implements DomainError {
  constructor() {
    super('Credentials are not valid.')
  }
}
