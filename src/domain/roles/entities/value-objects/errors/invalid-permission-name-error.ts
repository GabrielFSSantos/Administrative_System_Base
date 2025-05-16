import { DomainError } from '@/core/errors/domain-error'

export class InvalidPermissionNameError extends Error implements DomainError {
  constructor(value: string) {
    super(`Provided permission "${value}" is invalid.`)
  }
}
