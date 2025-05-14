
import { Either } from '@/core/either'

import { User } from '../../entities/user'
import { InvalidPaginationParamsError } from '../errors/invalid-pagination-params-error'

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
