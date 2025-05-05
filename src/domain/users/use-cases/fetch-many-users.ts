import { Injectable } from '@nestjs/common'

import { right } from '@/core/either'

import { UsersRepository } from '../repositories/users-repository'
import { IFetchManyUsersUseCaseRequest, IFetchManyUsersUseCaseResponse } from './contracts/fetch-many-users.interface'

@Injectable()
export class FetchManyUsersUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({ page, pageSize, search, roleId, isActive }: IFetchManyUsersUseCaseRequest): 
  Promise<IFetchManyUsersUseCaseResponse> {

    const users = await this.usersRepository.findMany({ page, pageSize, search, roleId, isActive })

    return right({
      users,
    })
  }
}
