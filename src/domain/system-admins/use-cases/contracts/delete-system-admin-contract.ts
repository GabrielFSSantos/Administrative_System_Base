import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export interface IDeleteSystemAdminUseCaseRequest {
  systemAdminId: string
}

export type IDeleteSystemAdminUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export abstract class DeleteSystemAdminContract {
  abstract execute(
    input: IDeleteSystemAdminUseCaseRequest
  ): Promise<IDeleteSystemAdminUseCaseResponse>
}