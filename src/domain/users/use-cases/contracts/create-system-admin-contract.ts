import { Either } from '@/core/either'
import { SystemAdmin } from '@/domain/users/entities/system-admin'
import { SystemAdminAlreadyExistsError } from '@/domain/users/use-cases/errors/system-admin-already-exists-error'

export interface ICreateSystemAdminUseCaseRequest {
  recipientId: string
  profileId: string
}

export type ICreateSystemAdminUseCaseResponse = Either<
  SystemAdminAlreadyExistsError,
  {
    systemAdmin: SystemAdmin
  }
>

export abstract class CreateSystemAdminContract {
  abstract execute(
    input: ICreateSystemAdminUseCaseRequest,
  ): Promise<ICreateSystemAdminUseCaseResponse>
}
