import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { SystemAdmin } from '../../entities/system-admin'

export interface IGetSystemAdminByRecipientIdUseCaseRequest {
  recipientId: string
}

export type IGetSystemAdminByRecipientIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    systemAdmin: SystemAdmin
  }
>

export abstract class GetSystemAdminByRecipientIdContract {
  abstract execute(
    input: IGetSystemAdminByRecipientIdUseCaseRequest
  ): Promise<IGetSystemAdminByRecipientIdUseCaseResponse>
}
