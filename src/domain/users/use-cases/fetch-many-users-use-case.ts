import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'

import { UsersRepositoryContract } from '../repositories/contracts/users-repository-contract'
import { 
  FetchManyUsersContract,
  IFetchManyUsersUseCaseRequest, 
  IFetchManyUsersUseCaseResponse, 
} from './contracts/fetch-many-users-contract'
import { InvalidPaginationParamsError } from './errors/invalid-pagination-params-error'

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
