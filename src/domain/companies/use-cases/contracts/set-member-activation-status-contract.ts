import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { AlreadyActivatedError } from '../../entities/errors/already-activated-error'
import { AlreadyDeactivatedError } from '../../entities/errors/already-deactivated-error'

export interface ISetMemberActivationStatusUseCaseRequest {
  memberId: string
  activationStatus: boolean
} 

export type ISetMemberActivationStatusUseCaseResponse = Either<
  ResourceNotFoundError | AlreadyActivatedError | AlreadyDeactivatedError,
  null
>

export abstract class SetMemberActivationStatusContract {
  abstract execute(input: ISetMemberActivationStatusUseCaseRequest): 
  Promise<ISetMemberActivationStatusUseCaseResponse> 
}
