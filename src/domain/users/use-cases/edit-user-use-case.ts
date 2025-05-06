import { Injectable } from '@nestjs/common'

import { left,right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { UsersRepositoryContract } from '../repositories/contracts/users-repository-contract'
import {
  EditUserContract,
  IEditUserUseCaseRequest, 
  IEditUserUseCaseResponse, 
} from './contracts/edit-user-contract'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

@Injectable()
export class EditUserUseCase implements EditUserContract{
  constructor(
    private usersRepository: UsersRepositoryContract,
  ) {}

  async execute({
    userId,
    name,
    email,
    roleId,
    isActive,
  }: IEditUserUseCaseRequest): Promise<IEditUserUseCaseResponse> {

    const user =  await this.usersRepository.findById(userId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    if(email && email !== user.email) {
      const userWithSameEmail =  await this.usersRepository.findByEmail(email)

      if(userWithSameEmail && userWithSameEmail.id.toString() !== user.id.toString()) {
        return left(new UserAlreadyExistsError(email))
      }

      user.email = email
    }

    if (name) {
      user.name = name
    }

    if (roleId) {
      user.roleId = new UniqueEntityId(roleId)
    }

    if (isActive === true) {
      user.activate()
    } else if (isActive === false) {
      user.deactivate()
    }

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
