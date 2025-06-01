import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { Member } from '../../entities/member'

export interface IGetMemberByRecipientIdAndOwnerIdUseCaseRequest {
  recipientId: string
  ownerId: string
}

export type IGetMemberByRecipientIdAndOwnerIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    member: Member
  }
>

export abstract class GetMemberByRecipientIdAndOwnerIdContract {
  abstract execute(
    input: IGetMemberByRecipientIdAndOwnerIdUseCaseRequest
  ): Promise<IGetMemberByRecipientIdAndOwnerIdUseCaseResponse>
}
