import { Either } from '@/core/either'

import { Role } from '../../entities/role'
import { InvalidPermissionError } from '../errors/invalid-permission-error'

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
