import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidSessionDateRevokedError extends Error implements UseCaseError {
  constructor() {
    super('Revoked date cannot be before creation date.')
  }
}
