import { Injectable } from '@nestjs/common'

import { right } from '@/core/either'

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

  async execute({ page, pageSize, search, roleId, isActive }: IFetchManyUsersUseCaseRequest): 
  Promise<IFetchManyUsersUseCaseResponse> {

    const users = await this.usersRepository.findMany({ page, pageSize, search, roleId, isActive })

    return right({
      users,
    })
  }
}
