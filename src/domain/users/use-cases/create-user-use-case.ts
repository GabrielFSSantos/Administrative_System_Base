import { Injectable } from '@nestjs/common'

import { HashGeneratorContract } from '@/core/contracts/cryptography/hash-generator-contract'
import { left,right } from '@/core/either'

import { User } from '../entities/user'
import { CPF } from '../entities/value-objects/cpf'
import { EmailAddress } from '../entities/value-objects/email-address'
import { Name } from '../entities/value-objects/name'
import { PasswordHash } from '../entities/value-objects/password-hash'
import { UsersRepositoryContract } from '../repositories/contracts/users-repository-contract'
import {
  CreateUserContract, 
  ICreateUserUseCaseRequest, 
  ICreateUserUseCaseResponse, 
} from './contracts/create-user-contract'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

@Injectable()
export class CreateUserUseCase implements CreateUserContract {
  constructor(
    private usersRepository: UsersRepositoryContract,
    private hashGenerator: HashGeneratorContract,
  ) {}

  async execute({
    cpf,
    name,
    emailAddress,
    password,
  }: ICreateUserUseCaseRequest): Promise<ICreateUserUseCaseResponse> {
    const existingUser =
      await this.usersRepository.findByEmail(emailAddress)

    if (existingUser) {
      return left(new UserAlreadyExistsError(emailAddress))
    }

    const cpfObject = CPF.create(cpf)
    const nameObject = Name.create(name)
    const emailObject = EmailAddress.create(emailAddress)
    const passwordObject = await PasswordHash.generateFromPlain(password, this.hashGenerator)

    const user = User.create({
      cpf: cpfObject,
      name: nameObject,
      emailAddress: emailObject,
      passwordHash: passwordObject,
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })
  }
}
