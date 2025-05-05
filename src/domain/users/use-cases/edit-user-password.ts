import { Injectable } from '@nestjs/common'

import { HashComparer } from '@/core/contracts/cryptography/hash-comparer'
import { HashGenerator } from '@/core/contracts/cryptography/hash-generator'
import { left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { UsersRepository } from '../repositories/users-repository'
import { 
  IEditUserPasswordUseCaseRequest, 
  IEditUserPasswordUseCaseResponse, 
} from './contracts/edit-user-password.interface'
import { SamePasswordError } from './errors/same-password-error'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

@Injectable()
export class EditUserPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
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
