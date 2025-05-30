import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { Member } from '../../entities/member'

export interface IGetMemberByIdUseCaseRequest {
  memberId: string
}

export type IGetMemberByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    member: Member
  }
>

export abstract class GetMemberByIdContract {
  abstract execute(
    input: IGetMemberByIdUseCaseRequest
  ): Promise<IGetMemberByIdUseCaseResponse>
}
