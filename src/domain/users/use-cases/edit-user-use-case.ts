import { Injectable } from '@nestjs/common'

import { left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Name } from '@/shared/value-objects/name'

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

      if(newEmail.isLeft()) {
        return left(newEmail.value)
      }
    
      const userWithSameEmail =  await this.usersRepository.findByEmail(newEmail.value.toString())

      if(userWithSameEmail && !userWithSameEmail.id.equals(user.id)) {
        return left(new UserAlreadyExistsError(newEmail.value.toString()))
      }

      user.changeEmail(newEmail.value)
    }

    if (name) {
      const newName = Name.create(name)

      if(newName.isLeft()) {
        return left(newName.value)
      }

      user.changeName(newName.value)
    }

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
