import { Injectable } from '@nestjs/common'

import { right } from '@/core/either'
import { ICreateSessionUseCase } from '@/domain/sessions/use-cases/contracts/create-session.interface'
import { IAuthenticateUserUseCase } from '@/domain/users/use-cases/contracts/authenticate-user.interface'

import { ILoginUserServiceRequest, ILoginUserServiceResponse } from './contracts/login-user-service.interface'

@Injectable()
export class LoginUserService  {
  constructor(
    private readonly authenticateUser: IAuthenticateUserUseCase,
    private readonly createSession: ICreateSessionUseCase,
  ) {}

  async execute({email, password}: ILoginUserServiceRequest): 
  Promise<ILoginUserServiceResponse> {
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
