import { Injectable } from '@nestjs/common'

import { left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { UsersRepositoryContract } from '../repositories/contracts/users-repository-contract'
import {
  DeleteUserContract,
  IDeleteUserUseCaseRequest, 
  IDeleteUserUseCaseResponse, 
} from './contracts/delete-user-contract'

@Injectable()
export class DeleteUserUseCase implements DeleteUserContract {
  constructor(
    private usersRepository: UsersRepositoryContract,
  ) {}

  async execute({ userId }: IDeleteUserUseCaseRequest): Promise<IDeleteUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    await this.usersRepository.delete(user.id)

    return right(null)
  }
}
