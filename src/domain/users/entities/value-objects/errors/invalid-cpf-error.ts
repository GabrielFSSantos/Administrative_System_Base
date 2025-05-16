import { DomainError } from '@/core/errors/domain-error'

export class InvalidCPFError extends Error implements DomainError {
  constructor() {
    super('Provided CPF is invalid.')
  }
}
