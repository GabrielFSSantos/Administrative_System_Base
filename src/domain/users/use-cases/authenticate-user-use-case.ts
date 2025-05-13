import { Injectable } from '@nestjs/common'

import { EncrypterContract } from '@/core/contracts/cryptography/encrypter-contract'
import { HashComparerContract } from '@/core/contracts/cryptography/hash-comparer-contract'
import { left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { UsersRepositoryContract } from '../repositories/contracts/users-repository-contract'
import { AuthenticateUserContract, 
  IAuthenticateUserUseCaseRequest, 
  IAuthenticateUserUseCaseResponse, 
} from './contracts/authenticate-user-contract'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

@Injectable()
export class AuthenticateUserUseCase implements AuthenticateUserContract {
  constructor(
    private usersRepository: UsersRepositoryContract,
    private hashComparer: HashComparerContract,
    private encrypter: EncrypterContract,
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
