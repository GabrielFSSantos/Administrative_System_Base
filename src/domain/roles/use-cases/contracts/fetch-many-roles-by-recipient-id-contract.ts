import { Either } from '@/core/either'
import { Role } from '@/domain/roles/entities/role'

export interface IFetchManyRolesByRecipientIdRequest {
  recipientId: string
  page: number
  pageSize: number
}

export type IFetchManyRolesByRecipientIdResponse = Either<
  null,
  {
    roles: Role[]
  }
>

export abstract class FetchManyRolesByRecipientIdContract {
  abstract execute(
    input: IFetchManyRolesByRecipientIdRequest,
  ): Promise<IFetchManyRolesByRecipientIdResponse>
}
