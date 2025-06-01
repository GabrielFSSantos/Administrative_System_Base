import { DomainError } from '@/core/errors/domain-error'

export class InvalidTitleError extends Error implements DomainError {
  constructor() {
    super('Provided title is invalid.')
  }
}
