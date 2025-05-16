import { DomainError } from '@/core/errors/domain-error'

export class NotAllowedError extends Error implements DomainError {
  constructor() {
    super('Not allowed.')
  }
}
