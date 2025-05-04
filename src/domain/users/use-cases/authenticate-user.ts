import { Injectable } from '@nestjs/common'

import { Encrypter } from '@/core/contracts/cryptography/encrypter'
import { HashComparer } from '@/core/contracts/cryptography/hash-comparer'
import { left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { UsersRepository } from '../repositories/users-repository'
import { IAuthenticateUserUseCase, 
  IAuthenticateUserUseCaseRequest, 
  IAuthenticateUserUseCaseResponse, 
} from './contracts/authenticate-user.interface'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

@Injectable()
export class AuthenticateUserUseCase implements IAuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: IAuthenticateUserUseCaseRequest): Promise<IAuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    if (!user.isCurrentlyActive()) {
      return left(new NotAllowedError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.getHashedPassword(),
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const {accessToken, expiresAt} = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    return right({
      userId: user.id.toString(),
      accessToken, 
      expiresAt,
    })
  }
}
