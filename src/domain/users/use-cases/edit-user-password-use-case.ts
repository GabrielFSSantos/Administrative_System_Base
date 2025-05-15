import { Injectable } from '@nestjs/common'

import { left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { HashComparerContract } from '@/shared/contracts/cryptography/hash-comparer-contract'
import { HashGeneratorContract } from '@/shared/contracts/cryptography/hash-generator-contract'

import { PasswordHash } from '../entities/value-objects/password-hash'
import { UsersRepositoryContract } from '../repositories/contracts/users-repository-contract'
import {
  EditUserPasswordContract,
  IEditUserPasswordUseCaseRequest, 
  IEditUserPasswordUseCaseResponse, 
} from './contracts/edit-user-password-contract'
import { SamePasswordError } from './errors/same-password-error'

@Injectable()
export class EditUserPasswordUseCase implements EditUserPasswordContract{
  constructor(
    private usersRepository: UsersRepositoryContract,
    private hashComparer: HashComparerContract,
    private hashGenerator: HashGeneratorContract,
  ) {}

  async execute({
    userId,
    password,
    newPassword,
  }: IEditUserPasswordUseCaseRequest): Promise<IEditUserPasswordUseCaseResponse> {

    const user =  await this.usersRepository.findById(userId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    const isPasswordValid = await user.passwordHash.compareWith(this.hashComparer, password)

    if (isPasswordValid.isLeft()) {
      return left(isPasswordValid.value)
    }

    const isSamePassword = await user.passwordHash.compareWith(this.hashComparer, newPassword)

    if (isSamePassword.isRight()) {
      return left(new SamePasswordError())
    }

    const newPasswordHash = await PasswordHash.createFromPlain(this.hashGenerator, newPassword)

    if (newPasswordHash.isLeft()) {
      return left(newPasswordHash.value)
    }

    user.changePasswordHash(newPasswordHash.value)

    await this.usersRepository.save(user)

    return right(null)
  }
}
