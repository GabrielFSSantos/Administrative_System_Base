import { Either } from '@/core/either'
import { Member } from '@/domain/members/entities/member'
import { MemberAlreadyExistsError } from '@/domain/members/use-cases/errors/member-already-exists-error'

export interface ICreateMemberUseCaseRequest {
  recipientId: string
  companyId: string
  profileId: string
}

export type ICreateMemberUseCaseResponse = Either<
  MemberAlreadyExistsError,
  {
    member: Member
  }
>

export abstract class CreateMemberContract {
  abstract execute(
    input: ICreateMemberUseCaseRequest,
  ): Promise<ICreateMemberUseCaseResponse>
}
