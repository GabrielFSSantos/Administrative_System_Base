import { DomainError } from '@/core/errors/domain-error'

export class InvalidErrorNameError extends Error implements DomainError {
  constructor() {
    super('Error name cannot be empty.')
  }
}
