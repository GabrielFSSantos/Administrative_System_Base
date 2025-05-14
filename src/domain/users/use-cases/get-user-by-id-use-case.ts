import { Injectable } from '@nestjs/common'

import { left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { UsersRepositoryContract } from '../repositories/contracts/users-repository-contract'
import {
  GetUserByIdContract,
  IGetUserByIdUseCaseRequest, 
  IGetUserByIdUseCaseResponse, 
} from './contracts/get-user-by-id-contract'

@Injectable()
export class GetUserByIdUseCase implements GetUserByIdContract{
  constructor(
    private usersRepository: UsersRepositoryContract,
  ) {}

  async execute({ userId }: IGetUserByIdUseCaseRequest): 
  Promise<IGetUserByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    return right({
      user,
    })
  }
}
