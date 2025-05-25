import { DomainError } from '@/core/errors/domain-error'

export class InvalidPaginationParamsError extends Error implements DomainError {
  constructor() {
    super('Pagination parameters must be greater than zero.')
  }
}