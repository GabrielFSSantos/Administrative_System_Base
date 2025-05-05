import { Injectable } from '@nestjs/common'

import { IRevokeSessionUseCase } from '@/domain/sessions/use-cases/contracts/revoke-session.interface'

import { ILogoutUserServiceUseCaseRequest, ILogoutUserServiceUseCaseResponse } from './contracts/logout-user-service.interface'

@Injectable()
export class LogoutUserService {
  constructor(
    private readonly revokeSession: IRevokeSessionUseCase,
  ) {}

  async execute({recipientId, accessToken }: ILogoutUserServiceUseCaseRequest): 
  Promise<ILogoutUserServiceUseCaseResponse> {
    return this.revokeSession.execute({ recipientId, accessToken })
  }
}
