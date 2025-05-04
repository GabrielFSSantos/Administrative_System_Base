
import { Either } from '@/core/either'

import { User } from '../../entities/user'

export interface IFetchManyUsersUseCaseRequest {
  page: number
  pageSize: number
  search?: string
  role?: string
  isActive?: Date
}

export type IFetchManyUsersUseCaseResponse = Either<
  null,
  {
    users: User[]
  }
>

export interface IFetchManyUsersUseCase {
  execute(input: IFetchManyUsersUseCaseRequest): Promise<IFetchManyUsersUseCaseResponse> 
}
