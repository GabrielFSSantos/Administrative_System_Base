import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { AlreadyActivatedError } from '../../value-objects/errors/already-activated-error'
import { AlreadyDeactivatedError } from '../../value-objects/errors/already-deactivated-error'

export interface ISetActivationStatusUseCaseRequest {
  entityId: string
  activationStatus: boolean
} 

export type ISetActivationStatusUseCaseResponse = Either<
  ResourceNotFoundError | AlreadyActivatedError | AlreadyDeactivatedError,
  null
>

export abstract class SetActivationStatusContract {
  abstract execute(input: ISetActivationStatusUseCaseRequest): 
  Promise<ISetActivationStatusUseCaseResponse> 
}
