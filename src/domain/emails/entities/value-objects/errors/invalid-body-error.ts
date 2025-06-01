import { DomainError } from '@/core/errors/domain-error'

export class InvalidBodyError extends Error implements DomainError {
  constructor() {
    super('Provided body is invalid.')
  }
}
