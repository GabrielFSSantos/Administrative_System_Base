import { Injectable } from '@nestjs/common'

import { Encrypter } from '@/core/contracts/cryptography/encrypter'
import { HashComparer } from '@/core/contracts/cryptography/hash-comparer'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'

import { Session } from '../entities/session'
import { AccountsRepository } from '../repositories/accounts-repository'
import { SessionsRepository } from '../repositories/sessions-repository'

interface CreateSessionUseCaseRequest {
  email: string
  password: string
}

type CreateSessionUseCaseResponse = Either<
  WrongCredentialsError | NotAllowedError,
  {
    accessToken: string
  }
>

@Injectable()
export class CreateSessionUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private accountsRepository: AccountsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: CreateSessionUseCaseRequest): Promise<CreateSessionUseCaseResponse> {
    const account = await this.accountsRepository.findByEmail(email)

    if (!account) {
      return left(new WrongCredentialsError())
    }

    if (!account.isCurrentlyActive()) {
      return left(new NotAllowedError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      account.getHashedPassword(),
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const {accessToken, expiresAt} = await this.encrypter.encrypt({
      sub: account.id.toString(),
    })

    const session = Session.create({
      recipientId: account.id,
      token: accessToken,
      expiresAt,
    })

    await this.sessionsRepository.create(session)

    return right({
      accessToken,
    })
  }
}
