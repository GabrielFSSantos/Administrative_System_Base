import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { Member } from '../../entities/member'

export interface IEditMemberUseCaseRequest {
  memberId: string
  profileId: string
}

export type IEditMemberUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    member: Member
  }
>

export abstract class EditMemberContract {
  abstract execute(
    input: IEditMemberUseCaseRequest
  ): Promise<IEditMemberUseCaseResponse>
}
