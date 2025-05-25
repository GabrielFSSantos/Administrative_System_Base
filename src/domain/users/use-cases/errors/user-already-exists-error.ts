import { DomainError } from '@/core/errors/domain-error'

export class UserAlreadyExistsError extends Error implements DomainError {
  constructor(identifier: string) {
    super(`User ${identifier} already exists.`)
  }
}
