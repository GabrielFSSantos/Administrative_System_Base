import { Injectable } from '@nestjs/common'

import { left,right } from '@/core/either'
import { HashGeneratorContract } from '@/shared/contracts/cryptography/hash-generator-contract'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Name } from '@/shared/value-objects/name'

import { User } from '../entities/user'
import { CPF } from '../entities/value-objects/cpf'
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

    if(nameObject.isLeft()) {
      return left(nameObject.value)
    }

    const cpfObject = CPF.create(cpf)

    if(cpfObject.isLeft()) {
      return left(cpfObject.value)
    }

    const emailObject = EmailAddress.create(emailAddress)

    if(emailObject.isLeft()) {
      return left(emailObject.value)
    }

    const passwordObject = await PasswordHash.createFromPlain(this.hashGenerator, password)

    if(passwordObject.isLeft()) {
      return left(passwordObject.value)
    }

    const existingCpfUser =
      await this.usersRepository.findByCpf(cpfObject.value.toString())

    if (existingCpfUser) {
      return left(new UserAlreadyExistsError(cpfObject.value.toString()))
    }
    
    const existingEmailUser =
      await this.usersRepository.findByEmail(emailObject.value.toString())

    if (existingEmailUser) {
      return left(new UserAlreadyExistsError(emailObject.value.toString()))
    }

    const user = User.create({
      cpf: cpfObject.value,
      name: nameObject.value,
      emailAddress: emailObject.value,
      passwordHash: passwordObject.value,
    })

    if(user.isLeft()) {
      return left(user.value)
    }

    await this.usersRepository.create(user.value)

    return right({
      user: user.value,
    })
  }
}
