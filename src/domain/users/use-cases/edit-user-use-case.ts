import { Injectable } from '@nestjs/common'

import { left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { EmailAddress } from '../entities/value-objects/email-address'
import { Name } from '../entities/value-objects/name'
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
    emailAddress,
  }: IEditUserUseCaseRequest): Promise<IEditUserUseCaseResponse> {

    const user =  await this.usersRepository.findById(userId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    if(emailAddress && emailAddress !== user.emailAddress.value) {
      const newEmail = EmailAddress.create(emailAddress)
      const userWithSameEmail =  await this.usersRepository.findByEmail(newEmail.value)

      if(userWithSameEmail && !userWithSameEmail.id.equals(user.id)) {
        return left(new UserAlreadyExistsError(newEmail.value))
      }

      user.changeEmail(newEmail)
    }

    if (name) {
      const newName = Name.create(name)

      user.changeName(newName)
    }

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
