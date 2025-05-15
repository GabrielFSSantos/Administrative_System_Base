import { Injectable } from '@nestjs/common'

import { right } from '@/core/either'
import { CreateSessionContract } from '@/domain/sessions/use-cases/contracts/create-session-contract'
import { AuthenticateUserContract } from '@/domain/users/use-cases/contracts/authenticate-user-contract'

import { 
  ILoginUserRequest, 
  ILoginUserResponse, 
  LoginUserContract,
} from './contracts/login-user-contract'

@Injectable()
export class LoginUserService implements LoginUserContract{
  constructor(
    private readonly authenticateUser: AuthenticateUserContract,
    private readonly createSession: CreateSessionContract,
  ) {}

  async execute({emailAddress, password}: ILoginUserRequest): 
  Promise<ILoginUserResponse> {
    const result = await this.authenticateUser.execute({emailAddress, password})

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
