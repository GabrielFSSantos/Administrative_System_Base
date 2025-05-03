import { Injectable } from '@nestjs/common'
import { Either, right, left } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { HashComparer } from '@/core/contracts/cryptography/hash-comparer'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'
import { HashGenerator } from '@/core/contracts/cryptography/hash-generator'
import { SamePasswordError } from './errors/same-password-error'

interface EditUserPasswordUseCaseRequest {
  userId: string
  password: string
  newPassword: string
}

type EditUserPasswordUseCaseResponse = Either<
  ResourceNotFoundError | WrongCredentialsError | SamePasswordError,
  null
>

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
  }: EditUserPasswordUseCaseRequest): Promise<EditUserPasswordUseCaseResponse> {

    const user =  await this.usersRepository.findById(userId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const isSamePassword = password === newPassword ? true : false

    if (isSamePassword) {
      return left(new SamePasswordError())
    }

    const hashPassword = await this.hashGenerator.generate(newPassword)

    user.password = hashPassword

    await this.usersRepository.save(user)

    return right(null)
  }
}
