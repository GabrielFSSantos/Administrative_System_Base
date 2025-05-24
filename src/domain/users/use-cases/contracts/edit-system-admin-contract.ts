import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { SystemAdmin } from '../../entities/system-admin'
import { SystemAdminAlreadyExistsError } from '../errors/system-admin-already-exists-error'

export interface IEditSystemAdminUseCaseRequest {
  systemAdminId: string
  profileId?: string
}

export type IEditSystemAdminUseCaseResponse = Either<
  ResourceNotFoundError | SystemAdminAlreadyExistsError,
  {
    systemAdmin: SystemAdmin
  }
>

export abstract class EditSystemAdminContract {
  abstract execute(
    input: IEditSystemAdminUseCaseRequest
  ): Promise<IEditSystemAdminUseCaseResponse>
}
