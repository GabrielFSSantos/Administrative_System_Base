import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { Company } from '../../entities/company'

export interface IGetCompanyByIdUseCaseRequest {
  companyId: string
}

export type IGetCompanyByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    company: Company
  }
>

export abstract class GetCompanyByIdContract {
  abstract execute(
    input: IGetCompanyByIdUseCaseRequest
  ): Promise<IGetCompanyByIdUseCaseResponse>
}
