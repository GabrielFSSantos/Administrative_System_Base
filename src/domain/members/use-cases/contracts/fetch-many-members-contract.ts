
import { Either } from '@/core/either'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { Member } from '../../entities/member'

export interface IFetchManyMembersUseCaseRequest {
  ownerId: string
  page: number
  pageSize: number
  search?: string
}

export type IFetchManyMembersUseCaseResponse = Either<
  InvalidPaginationParamsError,
  {
    members: Member[]
    pagination: {
      page: number
      pageSize: number
      total: number
    },
  }
>

export abstract class FetchManyMembersContract {
  abstract execute(input: IFetchManyMembersUseCaseRequest): 
  Promise<IFetchManyMembersUseCaseResponse> 
}
