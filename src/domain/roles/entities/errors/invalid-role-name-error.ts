import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidRoleNameError extends Error implements UseCaseError {
  constructor(name: string) {
    super(`Invalid role name: "${name}"`)
  }
}
