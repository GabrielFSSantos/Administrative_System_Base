import { DomainError } from '@/core/errors/domain-error'

export class SamePasswordError extends Error implements DomainError {
  constructor() {
    super('The new password must be different from the current one.')
  }
}
