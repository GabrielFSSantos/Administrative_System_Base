import { Either } from '@/core/either'
import { InvalidPermissionError } from '@/shared/watched-lists/PermissionList/helpers/errors/invalid-permission-error'

import { Role } from '../../entities/role'

export interface ICreateRoleUseCaseRequest {
  recipientId: string
  name: string
  permissionValues: string[]
}

export type ICreateRoleUseCaseResponse = Either<
  InvalidPermissionError,
  { 
    role: Role
   }
>

export abstract class CreateRoleContract {
  abstract execute(input: ICreateRoleUseCaseRequest): 
  Promise<ICreateRoleUseCaseResponse>
}
