import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { SessionsRepository } from '../repositories/sessions-repository'
import { AccountsRepository } from '../repositories/accounts-repository'
import { WrongCredentialsError } from '@/domain/sessions/use-cases/errors/wrong-credentials-error'
import { HashComparer } from '@/core/cryptography/hash-comparer'
import { Encrypter } from '@/core/cryptography/encrypter'
import { Session } from '../entities/session'

interface CreateSessionUseCaseRequest {
  email: string
  password: string
}

type CreateSessionUseCaseResponse = Either<
  WrongCredentialsError,
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

    const isPasswordValid = await this.hashComparer.compare(
      password,
      account.password,
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
