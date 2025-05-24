import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { SystemAdminsRepositoryContract } from '../repositories/contracts/system-admins-repository-contract'
import {
  FetchManySystemAdminsContract,
  IFetchManySystemAdminsUseCaseRequest,
  IFetchManySystemAdminsUseCaseResponse,
} from './contracts/fetch-many-system-admins-contract'

@Injectable()
export class FetchManySystemAdminsUseCase implements FetchManySystemAdminsContract {
  constructor(
    private readonly systemAdminsRepository: SystemAdminsRepositoryContract,
  ) {}

  async execute({
    page,
    pageSize,
    search,
  }: IFetchManySystemAdminsUseCaseRequest): Promise<IFetchManySystemAdminsUseCaseResponse> {
    if (page < 1 || pageSize < 1) {
      return left(new InvalidPaginationParamsError())
    }

    const { systemAdmins, total } = await this.systemAdminsRepository.findMany({
      page,
      pageSize,
      search,
    })

    return right({
      systemAdmins,
      pagination: {
        page,
        pageSize,
        total,
      },
    })
  }
}
