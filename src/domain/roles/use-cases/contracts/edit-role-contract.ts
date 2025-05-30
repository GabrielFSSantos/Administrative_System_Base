import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { InvalidPermissionError } from '@/shared/watched-lists/PermissionList/helpers/errors/invalid-permission-error'

import { Role } from '../../entities/role'

export interface IEditRoleUseCaseRequest {
  roleId: string,
  name?: string
  permissionValues?: string[]
}

export type IEditRoleUseCaseResponse = Either<
  ResourceNotFoundError | InvalidPermissionError,
  {
    role: Role
  }
>

export abstract class EditRoleContract {
  abstract execute(input: IEditRoleUseCaseRequest): 
  Promise<IEditRoleUseCaseResponse>
}
