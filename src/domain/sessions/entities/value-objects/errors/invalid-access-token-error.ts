import { DomainError } from '@/core/errors/domain-error'

export class InvalidAccessTokenError extends Error implements DomainError {
  constructor() {
    super('Provided access token is invalid.')
  }
}
