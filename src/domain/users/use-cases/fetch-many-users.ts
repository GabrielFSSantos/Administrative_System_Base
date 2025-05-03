import { User } from '../entities/user'
import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { UserSearchParams } from '../dtos/user-search-params'

type FetchManyUsersUseCaseRequest = UserSearchParams

type FetchManyUsersUseCaseResponse = Either<
  null,
  {
    users: User[]
  }
>

@Injectable()
export class FetchManyUsersUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({ page, pageSize, search, role, isActive }: FetchManyUsersUseCaseRequest): Promise<FetchManyUsersUseCaseResponse> {

    const users = await this.usersRepository.findMany({ page, pageSize, search, role, isActive })

    return right({
      users,
    })
  }
}
