import { DomainError } from '@/core/errors/domain-error'

export class InvalidActionLinkError extends Error implements DomainError {
  constructor() {
    super('Provided action link is invalid.')
  }
}
