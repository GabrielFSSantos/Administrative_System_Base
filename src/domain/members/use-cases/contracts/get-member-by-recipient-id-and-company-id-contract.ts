import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { Member } from '../../entities/member'

export interface IGetMemberByRecipientIdAndCompanyIdUseCaseRequest {
  recipientId: string
  companyId: string
}

export type IGetMemberByRecipientIdAndCompanyIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    member: Member
  }
>

export abstract class GetMemberByRecipientIdAndCompanyIdContract {
  abstract execute(
    input: IGetMemberByRecipientIdAndCompanyIdUseCaseRequest
  ): Promise<IGetMemberByRecipientIdAndCompanyIdUseCaseResponse>
}
