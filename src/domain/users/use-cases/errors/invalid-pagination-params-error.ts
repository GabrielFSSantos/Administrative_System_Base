import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidPaginationParamsError extends Error implements UseCaseError {
  constructor() {
    super('Pagination parameters must be greater than zero.')
  }
}