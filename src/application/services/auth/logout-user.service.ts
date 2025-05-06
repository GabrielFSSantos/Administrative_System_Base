import { Injectable } from '@nestjs/common'

import { RevokeSessionContract } from '@/domain/sessions/use-cases/contracts/revoke-session-contract'

import {
  ILogoutUserRequest, 
  ILogoutUserResponse, 
  LogoutUserContract,
} from './contracts/logout-user-contract'

@Injectable()
export class LogoutUserService implements LogoutUserContract{
  constructor(
    private readonly revokeSession: RevokeSessionContract,
  ) {}

  async execute({recipientId, accessToken }: ILogoutUserRequest): 
  Promise<ILogoutUserResponse> {
    return this.revokeSession.execute({ recipientId, accessToken })
  }
}
