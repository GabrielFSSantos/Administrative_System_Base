import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export interface IDeleteMemberUseCaseRequest {
  memberId: string
}

export type IDeleteMemberUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export abstract class DeleteMemberContract {
  abstract execute(
    input: IDeleteMemberUseCaseRequest
  ): Promise<IDeleteMemberUseCaseResponse>
}
