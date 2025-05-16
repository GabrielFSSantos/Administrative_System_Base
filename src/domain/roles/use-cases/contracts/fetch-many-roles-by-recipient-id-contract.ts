import { Either } from '@/core/either'
import { Role } from '@/domain/roles/entities/role'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

export interface IFetchManyRolesByRecipientIdRequest {
  recipientId: string
  page: number
  pageSize: number
}

export type IFetchManyRolesByRecipientIdResponse = Either<
  InvalidPaginationParamsError,
  {
    roles: Role[]
    pagination: {
      page: number
      pageSize: number
      total: number
    },
  }
>

export abstract class FetchManyRolesByRecipientIdContract {
  abstract execute(
    input: IFetchManyRolesByRecipientIdRequest,
  ): Promise<IFetchManyRolesByRecipientIdResponse>
}
