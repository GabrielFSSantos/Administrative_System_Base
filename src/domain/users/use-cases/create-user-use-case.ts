import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { HashGeneratorContract } from '@/shared/services/cryptography/contracts/hash-generator-contract'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Locale } from '@/shared/value-objects/locale/locale'
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
    private readonly usersRepository: UsersRepositoryContract,
    private readonly hashGenerator: HashGeneratorContract,
  ) {}

  async execute({
    cpf,
    name,
    emailAddress,
    password,
    locale,
  }: ICreateUserUseCaseRequest): Promise<ICreateUserUseCaseResponse> {
    const nameOrError = Name.create(name)

    if (nameOrError.isLeft()) return left(nameOrError.value)

    const cpfOrError = CPF.create(cpf)

    if (cpfOrError.isLeft()) return left(cpfOrError.value)

    const emailOrError = EmailAddress.create(emailAddress)

    if (emailOrError.isLeft()) return left(emailOrError.value)

    const localeOrError = Locale.create(locale)

    if (localeOrError.isLeft()) return left(localeOrError.value)

    const passwordHashOrError = await PasswordHash.createFromPlain(
      this.hashGenerator,
      password,
    )

    if (passwordHashOrError.isLeft()) return left(passwordHashOrError.value)

    const cpfExists = await this.usersRepository.findByCpf(cpfOrError.value.toString())

    if (cpfExists) return left(new UserAlreadyExistsError(cpfOrError.value.toString()))

    const emailExists = await this.usersRepository.findByEmail(emailOrError.value.toString())

    if (emailExists) return left(new UserAlreadyExistsError(emailOrError.value.toString()))

    const userOrError = User.create({
      cpf: cpfOrError.value,
      name: nameOrError.value,
      emailAddress: emailOrError.value,
      passwordHash: passwordHashOrError.value,
      locale: localeOrError.value,
    })

    if (userOrError.isLeft()) return left(userOrError.value)

    await this.usersRepository.create(userOrError.value)

    return right({ user: userOrError.value })
  }
}
