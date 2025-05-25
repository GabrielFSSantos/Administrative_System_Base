import { left, right } from '@/core/either'
import { Session } from '@/domain/sessions/entities/session'
import {
  IRevokeSessionUseCaseRequest,
  IRevokeSessionUseCaseResponse,
  RevokeSessionContract,
} from '@/domain/sessions/use-cases/contracts/revoke-session-contract'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'
import { NotAllowedError } from '@/shared/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export class FakeRevokeSessionUseCase implements RevokeSessionContract {
  public session: Session | null = null
  public shouldReturnExpired = false
  public shouldReturnNotAllowed = false
  public shouldReturnAlreadyRevoked = false
  public shouldReturnNotFound = false

  async execute({ recipientId }: IRevokeSessionUseCaseRequest): Promise<IRevokeSessionUseCaseResponse> {
    if (this.shouldReturnNotFound || !this.session) {
      return left(new ResourceNotFoundError())
    }

    if (this.shouldReturnExpired) {
      return left(new SessionExpiredError())
    }

    if (this.shouldReturnAlreadyRevoked) {
      return left(new NotAllowedError())
    }

    if (!this.session.belongsTo(recipientId)) {
      return left(new NotAllowedError())
    }

    if (this.session.isExpired()) {
      return left(new SessionExpiredError())
    }

    if (this.session.isRevoked()) {
      return left(new NotAllowedError())
    }

    this.session.revoke()

    return right(null)
  }
}
