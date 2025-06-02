import { Either } from '@/core/either'
import { Company } from '@/domain/companies/entities/company'
import { CompanyAlreadyExistsError } from '@/domain/companies/use-cases/errors/company-already-exists-error'
import { InvalidUpdatedAtError } from '@/shared/errors/invalid-updated-at-error'

export interface ICreateCompanyUseCaseRequest {
  cnpj: string
  name: string
  emailAddress: string
  permissionValues: string[]
  locale: string
}

export type ICreateCompanyUseCaseResponse = Either<
  InvalidUpdatedAtError | CompanyAlreadyExistsError,
  {
    company: Company
  }
>

export abstract class CreateCompanyContract {
  abstract execute(
    input: ICreateCompanyUseCaseRequest,
  ): Promise<ICreateCompanyUseCaseResponse>
}
