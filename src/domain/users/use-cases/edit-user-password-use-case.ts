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
import { WrongCredentialsError } from './errors/wrong-credentials-error'

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

    const isPasswordValid = await user.passwordHash.compareWith(password, this.hashComparer)

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const isSamePassword = await user.passwordHash.compareWith(newPassword, this.hashComparer)

    if (isSamePassword) {
      return left(new SamePasswordError())
    }

    const newPasswordHash = await PasswordHash.generateFromPlain(newPassword, this.hashGenerator)

    user.changePasswordHash(newPasswordHash)

    await this.usersRepository.save(user)

    return right(null)
  }
}
