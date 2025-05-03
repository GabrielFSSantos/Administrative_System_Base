import { Injectable } from '@nestjs/common'

import { Either, left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { UsersRepository } from '../repositories/users-repository'
import { AlreadyActivatedError } from './errors/already-activated-error'
import { AlreadyDeactivatedError } from './errors/already-deactivated-error'

interface SetUserActivationStatusUseCaseRequest {
  userId: string
  isActive: boolean
} 

type SetUserActivationStatusUseCaseResponse = Either<
  ResourceNotFoundError | AlreadyActivatedError | AlreadyDeactivatedError,
  null
>

@Injectable()
export class SetUserActivationStatusUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    isActive,
  }: SetUserActivationStatusUseCaseRequest): Promise<SetUserActivationStatusUseCaseResponse> {

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

    user.setActivationStatus(isActive)

    await this.usersRepository.save(user)

    return right(null)
  }
}
