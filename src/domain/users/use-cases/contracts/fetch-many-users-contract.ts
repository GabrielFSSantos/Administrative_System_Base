
import { Either } from '@/core/either'

import { User } from '../../entities/user'

export interface IFetchManyUsersUseCaseRequest {
  page: number
  pageSize: number
  search?: string
  roleId?: string
  isActive?: Date
}

export type IFetchManyUsersUseCaseResponse = Either<
  null,
  {
    users: User[]
  }
>

export abstract class FetchManyUsersContract {
  abstract execute(input: IFetchManyUsersUseCaseRequest): Promise<IFetchManyUsersUseCaseResponse> 
}
