import { DomainError } from '@/core/errors/domain-error'

export class InvalidSubjectError extends Error implements DomainError {
  constructor() {
    super('Provided subject is invalid.')
  }
}
