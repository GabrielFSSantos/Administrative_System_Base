import { Injectable } from '@nestjs/common'

import { right } from '@/core/either'

import { SessionsRepositoryContract } from '../repositories/contracts/sessions-repository-contract'
import {
  DeleteExpiredSessionsContract,
  IDeleteExpiredSessionsUseCaseResponse,
} from './contracts/delete-expired-sessions-contract'

@Injectable()
export class DeleteExpiredSessionsUseCase implements DeleteExpiredSessionsContract {
  constructor(
    private readonly sessionsRepository: SessionsRepositoryContract,
  ) {}

  async execute(): Promise<IDeleteExpiredSessionsUseCaseResponse> {
    await this.sessionsRepository.deleteExpiredSessions()

    return right(null)
  }
}
