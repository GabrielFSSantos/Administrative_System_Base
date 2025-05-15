import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidPermissionNameError extends Error implements UseCaseError {
  constructor(value: string) {
    super(`Provided permission "${value}" is invalid.`)
  }
}
