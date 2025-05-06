
import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { AlreadyActivatedError } from '../errors/already-activated-error'
import { AlreadyDeactivatedError } from '../errors/already-deactivated-error'

export interface ISetUserActivationStatusUseCaseRequest {
  userId: string
  isActive: boolean
} 

export type ISetUserActivationStatusUseCaseResponse = Either<
  ResourceNotFoundError | AlreadyActivatedError | AlreadyDeactivatedError,
  null
>

export abstract class SetUserActivationStatusContract {
  abstract execute(input: ISetUserActivationStatusUseCaseRequest): 
  Promise<ISetUserActivationStatusUseCaseResponse> 
}
