import { Either } from '@/core/either'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { Company } from '../../entities/company'

export interface IFetchManyCompaniesUseCaseRequest {
  page: number
  pageSize: number
  search?: string
}

export type IFetchManyCompaniesUseCaseResponse = Either<
  InvalidPaginationParamsError,
  {
    companies: Company[]
    pagination: {
      page: number
      pageSize: number
      total: number
    }
  }
>

export abstract class FetchManyCompaniesContract {
  abstract execute(
    input: IFetchManyCompaniesUseCaseRequest
  ): Promise<IFetchManyCompaniesUseCaseResponse>
}
