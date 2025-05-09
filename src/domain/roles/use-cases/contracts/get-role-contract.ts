import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Role } from '../../entities/role'

export interface IGetRoleUseCaseRequest {
  roleId: string
}

export type IGetRoleUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    role: Role
  }
>

export abstract class GetRoleContract {
  abstract execute(input: IGetRoleUseCaseRequest): Promise<IGetRoleUseCaseResponse>
}
