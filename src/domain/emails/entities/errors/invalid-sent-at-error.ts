import { DomainError } from '@/core/errors/domain-error'

export class InvalidSentAtError extends Error implements DomainError {
  constructor() {
    super('The sent date cannot be earlier than the creation date.')
  }
}
