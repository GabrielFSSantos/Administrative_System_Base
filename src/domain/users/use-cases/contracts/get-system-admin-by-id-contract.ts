import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { SystemAdmin } from '../../entities/system-admin'

export interface IGetSystemAdminByIdUseCaseRequest {
  systemAdminId: string
}

export type IGetSystemAdminByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    systemAdmin: SystemAdmin
  }
>

export abstract class GetSystemAdminByIdContract {
  abstract execute(
    input: IGetSystemAdminByIdUseCaseRequest
  ): Promise<IGetSystemAdminByIdUseCaseResponse>
}
