import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { EncrypterContract } from '@/shared/contracts/cryptography/encrypter-contract'
import { HashComparerContract } from '@/shared/contracts/cryptography/hash-comparer-contract'
import { EmailAddress } from '@/shared/value-objects/email-address'

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
    
    if(emailObject.isLeft()) {
      return left(emailObject.value)
    }

    const user = await this.usersRepository.findByEmail(emailObject.value.toString())

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await user.passwordHash.compareWith(this.hashComparer, password)
  
    if (isPasswordValid.isLeft()) {
      return left(isPasswordValid.value)
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
