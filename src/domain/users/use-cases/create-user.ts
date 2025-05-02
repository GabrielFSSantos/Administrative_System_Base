import { User } from '../entities/user'
import { Injectable } from '@nestjs/common'
import { Either, right, left } from '@/core/either'
import { HashGenerator } from '../../../core/contracts/cryptography/hash-generator'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string
  role: string
}

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>

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
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
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
      role,
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })
  }
}
