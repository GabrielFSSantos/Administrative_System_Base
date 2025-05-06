import { Injectable } from '@nestjs/common'

import { left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { UsersRepository } from '../repositories/users-repository'
import { 
  IGetUserUseCaseRequest, 
  IGetUserUseCaseResponse, 
} from './contracts/get-user.interface'

@Injectable()
export class GetUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
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
