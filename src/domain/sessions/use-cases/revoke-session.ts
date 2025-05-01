import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { SessionsRepository } from '../repositories/sessions-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SessionExpiredError } from './errors/session-expired-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface RevokeSessionUseCaseRequest {
  recipientId: string
  accessToken: string
}

type RevokeSessionUseCaseResponse = Either<
  ResourceNotFoundError | SessionExpiredError | NotAllowedError,
  null
>

@Injectable()
export class RevokeSessionUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
  ) {}

  async execute({
    recipientId,
    accessToken,
  }: RevokeSessionUseCaseRequest): Promise<RevokeSessionUseCaseResponse> {

    const session = await this.sessionsRepository.findByToken(accessToken)

    if (!session) {
      return left(new ResourceNotFoundError())
    }

    if (session.expiresAt < new Date()) {
      return left(new SessionExpiredError())
    }

    if(session.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError())
    }

    if(session.revokedAt) {
      return left(new NotAllowedError())
    }

    await this.sessionsRepository.revoke(session)

    return right(null)
  }
}
