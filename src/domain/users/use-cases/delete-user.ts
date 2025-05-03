import { Injectable } from '@nestjs/common'

import { Either, left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { UsersRepository } from '../repositories/users-repository'

interface DeleteUserUseCaseRequest {
  userId: string
}

type DeleteUserUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({ userId }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    await this.usersRepository.delete(user.id)

    return right(null)
  }
}
