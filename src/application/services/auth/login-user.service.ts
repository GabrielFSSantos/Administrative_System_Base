import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ICreateSessionUseCase } from '@/domain/sessions/use-cases/contracts/create-session.interface'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'
import { IAuthenticateUserUseCase } from '@/domain/users/use-cases/contracts/authenticate-user.interface'
import { WrongCredentialsError } from '@/domain/users/use-cases/errors/wrong-credentials-error'

interface LoginUserRequest {
  email: string
  password: string
}

type LoginUserResponse = Either<
  WrongCredentialsError | NotAllowedError | SessionExpiredError,
  {
    accessToken: string
  }
>

@Injectable()
export class LoginUserService  {
  constructor(
    private readonly authenticateUser: IAuthenticateUserUseCase,
    private readonly createSession: ICreateSessionUseCase,
  ) {}

  async execute({email, password}: LoginUserRequest): Promise<LoginUserResponse> {
    const result = await this.authenticateUser.execute({email, password})

    if (result.isLeft()) {
      return result
    }

    const { userId, accessToken, expiresAt } = result.value

    await this.createSession.execute({
      recipientId: userId,
      accessToken,
      expiresAt,
    })

    return right({ accessToken })
  }
}
