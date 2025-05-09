import { Either } from '@/core/either'

import { InvalidPermissionError } from '../errors/invalid-permission-error'

export interface ICreateRoleUseCaseRequest {
  name: string
  permissionValues: string[]
}

export type ICreateRoleUseCaseResponse = Either<
  InvalidPermissionError,
  null
>

export abstract class CreateRoleContract {
  abstract execute(input: ICreateRoleUseCaseRequest): Promise<ICreateRoleUseCaseResponse>
}
