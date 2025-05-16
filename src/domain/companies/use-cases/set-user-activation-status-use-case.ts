import { Injectable } from '@nestjs/common'

import { left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { UsersRepositoryContract } from '../repositories/contracts/users-repository-contract'
import {
  ISetUserActivationStatusUseCaseRequest, 
  ISetUserActivationStatusUseCaseResponse, 
  SetUserActivationStatusContract, 
} from './contracts/set-user-activation-status-contract'
import { AlreadyActivatedError } from './errors/already-activated-error'
import { AlreadyDeactivatedError } from './errors/already-deactivated-error'

@Injectable()
export class SetUserActivationStatusUseCase implements SetUserActivationStatusContract{
  constructor(
    private usersRepository: UsersRepositoryContract,
  ) {}

  async execute({
    userId,
    isActive,
  }: ISetUserActivationStatusUseCaseRequest): 
  Promise<ISetUserActivationStatusUseCaseResponse> {

    const user =  await this.usersRepository.findById(userId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    if(isActive && user.isCurrentlyActive()) {
      return left(new AlreadyActivatedError())
    }

    if(!isActive && !user.isCurrentlyActive()) {
      return left(new AlreadyDeactivatedError())
    }

    if (isActive === true) {
      user.activate()
    } else if (isActive === false) {
      user.deactivate()
    }

    await this.usersRepository.save(user)

    return right(null)
  }
}
