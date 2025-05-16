import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { UsersRepositoryContract } from '../repositories/contracts/users-repository-contract'
import { 
  FetchManyUsersContract,
  IFetchManyUsersUseCaseRequest, 
  IFetchManyUsersUseCaseResponse, 
} from './contracts/fetch-many-users-contract'

@Injectable()
export class FetchManyUsersUseCase implements FetchManyUsersContract{
  constructor(
    private usersRepository: UsersRepositoryContract,
  ) {}

  async execute({ page, pageSize, search}: IFetchManyUsersUseCaseRequest): 
  Promise<IFetchManyUsersUseCaseResponse> {
    if (page < 1 || pageSize < 1) {
      return left(new InvalidPaginationParamsError())
    }

    const {users, total} = await this.usersRepository.findMany({ page, pageSize, search})

    return right({
      users,
      pagination: {
        page,
        pageSize,
        total,
      },
    })
  }
}
