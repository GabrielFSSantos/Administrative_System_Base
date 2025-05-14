import { Injectable } from '@nestjs/common'

import { EncrypterContract } from '@/core/contracts/cryptography/encrypter-contract'
import { HashComparerContract } from '@/core/contracts/cryptography/hash-comparer-contract'
import { left, right } from '@/core/either'

import { EmailAddress } from '../entities/value-objects/email-address'
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
    emailAddress,
    password,
  }: IAuthenticateUserUseCaseRequest): Promise<IAuthenticateUserUseCaseResponse> {
    const emailObject = EmailAddress.create(emailAddress)

    const user = await this.usersRepository.findByEmail(emailObject.value)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await user.passwordHash.compareWith(password, this.hashComparer)
  
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
