import { left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Session } from '@/domain/sessions/entities/session'
import { 
  IRevokeSessionUseCase, 
  IRevokeSessionUseCaseRequest, 
  IRevokeSessionUseCaseResponse, 
} from '@/domain/sessions/use-cases/contracts/revoke-session.interface'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'

export class FakeRevokeSessionUseCase implements IRevokeSessionUseCase {
  public session: Session | null = null
  public shouldReturnExpired = false
  public shouldReturnNotAllowed = false
  public shouldReturnAlreadyRevoked = false
  public shouldReturnNotFound = false

  async execute({ recipientId }: IRevokeSessionUseCaseRequest): Promise<IRevokeSessionUseCaseResponse> {
    if (this.shouldReturnNotFound || !this.session) {
      return left(new ResourceNotFoundError())
    }

    if (this.shouldReturnExpired || this.session.isExpired()) {
      return left(new SessionExpiredError())
    }

    if (this.shouldReturnNotAllowed || this.session.belongsTo(recipientId)) {
      return left(new NotAllowedError())
    }

    if (this.shouldReturnAlreadyRevoked || this.session.isRevoked()) {
      return left(new NotAllowedError())
    }

    this.session.revoke()

    return right(null)
  }
}
