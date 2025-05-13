import { Injectable } from '@nestjs/common'

import { HashComparerContract } from '@/core/contracts/cryptography/hash-comparer-contract'
import { HashGeneratorContract } from '@/core/contracts/cryptography/hash-generator-contract'
import { left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

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

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.getHashedPassword(),
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const isSamePassword = password === newPassword

    if (isSamePassword) {
      return left(new SamePasswordError())
    }

    const hashPassword = await this.hashGenerator.generate(newPassword)

    user.changePassword(hashPassword)

    await this.usersRepository.save(user)

    return right(null)
  }
}
