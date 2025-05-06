import { Injectable } from '@nestjs/common'

import { HashGenerator } from '@/core/contracts/cryptography/hash-generator'
import { left,right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { User } from '../entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { 
  ICreateUserUseCaseRequest, 
  ICreateUserUseCaseResponse, 
} from './contracts/create-user.interface'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    roleId,
  }: ICreateUserUseCaseRequest): Promise<ICreateUserUseCaseResponse> {
    const userWithSameEmail =
      await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashPassword = await this.hashGenerator.generate(password)

    const user = User.create({
      name,
      email,
      password: hashPassword,
      roleId: new UniqueEntityId(roleId),
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })
  }
}
