import { DomainError } from '@/core/errors/domain-error'

export class InvalidSessionDateRevokedError extends Error implements DomainError {
  constructor() {
    super('Revoked date cannot be before creation date.')
  }
}
