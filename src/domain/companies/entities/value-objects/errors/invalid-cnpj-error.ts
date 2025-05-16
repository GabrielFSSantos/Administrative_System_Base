import { DomainError } from '@/core/errors/domain-error'

export class InvalidCNPJError extends Error implements DomainError {
  constructor() {
    super('Provided CNPJ is invalid.')
  }
}
