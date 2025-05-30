import { DomainError } from '@/core/errors/domain-error'

export class InvalidPermissionError extends Error implements DomainError {
  constructor(invalidPermissions: string[]) {
    super(`Invalid permissions: ${invalidPermissions.join(', ')}`)
  }
}
