import { DomainError } from '@/core/errors/domain-error'

export class AlreadyActivatedError extends Error implements DomainError {
  constructor() {
    super('User is already active.')
  }
}
