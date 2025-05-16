import { DomainError } from '@/core/errors/domain-error'

export class InvalidNameError extends Error implements DomainError {
  constructor() {
    super('Provided name is invalid.')
  }
}
