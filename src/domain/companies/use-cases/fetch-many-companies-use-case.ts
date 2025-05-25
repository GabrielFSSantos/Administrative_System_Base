import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { CompaniesRepositoryContract } from '../repositories/contracts/companies-repository-contract'
import {
  FetchManyCompaniesContract,
  IFetchManyCompaniesUseCaseRequest,
  IFetchManyCompaniesUseCaseResponse,
} from './contracts/fetch-many-companies-contract'

@Injectable()
export class FetchManyCompaniesUseCase implements FetchManyCompaniesContract {
  constructor(
    private readonly companiesRepository: CompaniesRepositoryContract,
  ) {}

  async execute({
    page,
    pageSize,
    search,
  }: IFetchManyCompaniesUseCaseRequest): Promise<IFetchManyCompaniesUseCaseResponse> {
    if (page < 1 || pageSize < 1) {
      return left(new InvalidPaginationParamsError())
    }

    const { companies, total } = await this.companiesRepository.findMany({
      page,
      pageSize,
      search,
    })

    return right({
      companies,
      pagination: {
        page,
        pageSize,
        total,
      },
    })
  }
}
