import { Either } from '@/core/either'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { SystemAdmin } from '../../entities/system-admin'

export interface IFetchManySystemAdminsUseCaseRequest {
  page: number
  pageSize: number
  search?: string
}

export type IFetchManySystemAdminsUseCaseResponse = Either<
  InvalidPaginationParamsError,
  {
    systemAdmins: SystemAdmin[]
    pagination: {
      page: number
      pageSize: number
      total: number
    },
  }
>

export abstract class FetchManySystemAdminsContract {
  abstract execute(
    input: IFetchManySystemAdminsUseCaseRequest,
  ): Promise<IFetchManySystemAdminsUseCaseResponse>
}
