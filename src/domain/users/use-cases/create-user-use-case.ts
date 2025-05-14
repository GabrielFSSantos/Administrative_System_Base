import { Injectable } from '@nestjs/common'

import { left,right } from '@/core/either'
import { HashGeneratorContract } from '@/shared/contracts/cryptography/hash-generator-contract'
import { Name } from '@/shared/value-objects/name'

import { User } from '../entities/user'
import { CPF } from '../entities/value-objects/cpf'
import { EmailAddress } from '../entities/value-objects/email-address'
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

    const nameObject = Name.create(name)
    const cpfObject = CPF.create(cpf)
    const emailObject = EmailAddress.create(emailAddress)
    const passwordObject = await PasswordHash.createFromPlain(password, this.hashGenerator)

    const existingCpfUser =
      await this.usersRepository.findByCpf(cpfObject.value)

    if (existingCpfUser) {
      return left(new UserAlreadyExistsError(cpfObject.value))
    }
    
    const existingEmailUser =
      await this.usersRepository.findByEmail(emailObject.value)

    if (existingEmailUser) {
      return left(new UserAlreadyExistsError(emailObject.value))
    }

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
