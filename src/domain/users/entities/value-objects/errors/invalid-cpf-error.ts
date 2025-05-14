import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidCPFError extends Error implements UseCaseError {
  constructor() {
    super('Provided CPF is invalid.')
  }
}
