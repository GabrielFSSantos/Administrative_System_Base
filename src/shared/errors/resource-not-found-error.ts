import { DomainError } from '@/core/errors/domain-error'

export class ResourceNotFoundError extends Error implements DomainError {
  constructor() {
    super('Resource not found.')
  }
}
