import { Injectable } from '@nestjs/common'

import { left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { UsersRepositoryContract } from '../repositories/contracts/users-repository-contract'
import {
  GetUserContract,
  IGetUserUseCaseRequest, 
  IGetUserUseCaseResponse, 
} from './contracts/get-user-contract'

@Injectable()
export class GetUserUseCase implements GetUserContract{
  constructor(
    private usersRepository: UsersRepositoryContract,
  ) {}

  async execute({ userId }: IGetUserUseCaseRequest): 
  Promise<IGetUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    return right({
      user,
    })
  }
}
