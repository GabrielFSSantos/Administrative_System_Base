import { DomainError } from '@/core/errors/domain-error'

export class CompanyAlreadyExistsError extends Error implements DomainError {
  constructor(cnpj: string) {
    super(
      `A company with CNPJ "${cnpj}" already exists.`,
    )
  }
}
