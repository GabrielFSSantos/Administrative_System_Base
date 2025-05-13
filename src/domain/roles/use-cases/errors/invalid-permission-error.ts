import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidPermissionError extends Error implements UseCaseError {
  constructor(invalidPermissions: string[]) {
    super(`Invalid permissions: ${invalidPermissions.join(', ')}`)
  }
}
