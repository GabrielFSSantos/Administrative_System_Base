import { Injectable } from '@nestjs/common'
import { Either, right, left } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

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
