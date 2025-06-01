import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { MembersRepositoryContract } from '../repositories/contracts/members-repository-contract'
import {
  FetchManyMembersContract,
  IFetchManyMembersUseCaseRequest,
  IFetchManyMembersUseCaseResponse,
} from './contracts/fetch-many-members-contract'

@Injectable()
export class FetchManyMembersUseCase implements FetchManyMembersContract {
  constructor(
    private readonly membersRepository: MembersRepositoryContract,
  ) {}

  async execute({
    ownerId,
    page,
    pageSize,
    search,
  }: IFetchManyMembersUseCaseRequest): Promise<IFetchManyMembersUseCaseResponse> {
    if (page < 1 || pageSize < 1) {
      return left(new InvalidPaginationParamsError())
    }

    const { members, total } = await this.membersRepository.findMany({
      ownerId,
      page,
      pageSize,
      search,
    })

    return right({
      members,
      pagination: {
        page,
        pageSize,
        total,
      },
    })
  }
}
