import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export interface IDeleteRoleUseCaseRequest {
  roleId: string
}

export type IDeleteRoleUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export abstract class DeleteRoleContract {
  abstract execute(input: IDeleteRoleUseCaseRequest): 
  Promise<IDeleteRoleUseCaseResponse>
}
