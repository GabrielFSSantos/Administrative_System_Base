import { Injectable } from '@nestjs/common'

import { Either, left,right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface EditUserUseCaseRequest {
  userId: string
  name?: string
  email?: string
  role?: string
  isActive?: boolean
}

type EditUserUseCaseResponse = Either<
  ResourceNotFoundError | UserAlreadyExistsError,
  {
    user: User
  }
>

@Injectable()
export class EditUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    name,
    email,
    role,
    isActive,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {

    const user =  await this.usersRepository.findById(userId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    if(email && email !== user.email) {
      const userWithSameEmail =  await this.usersRepository.findByEmail(email)

      if(userWithSameEmail && userWithSameEmail.id.toString() !== user.id.toString()) {
        return left(new UserAlreadyExistsError(email))
      }

      user.email = email
    }

    if (name) {
      user.name = name
    }

    if (role) {
      user.role = role
    }

    if (isActive !== undefined) {
      user.setActivationStatus(isActive)
    }

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
