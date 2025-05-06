import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { SessionsRepository } from '../repositories/sessions-repository'
import { 
  IRevokeSessionUseCaseRequest, 
  IRevokeSessionUseCaseResponse, 
  RevokeSessionContract, 
} from './contracts/revoke-session-contract'
import { SessionExpiredError } from './errors/session-expired-error'

@Injectable()
export class RevokeSessionUseCase implements RevokeSessionContract {
  constructor(
    private sessionsRepository: SessionsRepository,
  ) {}

  async execute({
    recipientId,
    accessToken,
  }: IRevokeSessionUseCaseRequest): Promise<IRevokeSessionUseCaseResponse> {

    const session = await this.sessionsRepository.findByToken(accessToken)

    if (!session) {
      return left(new ResourceNotFoundError())
    }

    if (session.isExpired()) {
      return left(new SessionExpiredError())
    }

    if(session.belongsTo(recipientId)) {
      return left(new NotAllowedError())
    }

    if(session.isRevoked()) {
      return left(new NotAllowedError())
    }

    session.revoke()

    await this.sessionsRepository.save(session)

    return right(null)
  }
}
