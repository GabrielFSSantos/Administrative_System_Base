
import { Either } from '@/core/either'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { User } from '../../entities/user'

export interface IFetchManyUsersUseCaseRequest {
  page: number
  pageSize: number
  search?: string
}

export type IFetchManyUsersUseCaseResponse = Either<
  InvalidPaginationParamsError,
  {
    users: User[]
    pagination: {
      page: number
      pageSize: number
      total: number
    },
  }
>

export abstract class FetchManyUsersContract {
  abstract execute(input: IFetchManyUsersUseCaseRequest): Promise<IFetchManyUsersUseCaseResponse> 
}
