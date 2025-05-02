import { User } from '../entities/user'
import { Injectable } from '@nestjs/common'
import { Either, right, left } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface GetUserUseCaseRequest {
  userId: string
}

type GetUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class GetUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({ userId }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    return right({
      user,
    })
  }
}
