import { left,right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Session } from '@/domain/sessions/entities/session'
import {
  CreateSessionContract,
  ICreateSessionUseCaseRequest,
  ICreateSessionUseCaseResponse,
} from '@/domain/sessions/use-cases/contracts/create-session-contract'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'

export class FakeCreateSessionUseCase implements CreateSessionContract {
  public shouldFail: boolean = false

  async execute({
    recipientId,
    accessToken,
    expiresAt,
  }: ICreateSessionUseCaseRequest): Promise<ICreateSessionUseCaseResponse> {
    if (this.shouldFail) {
      return left(new SessionExpiredError())
    }

    const session = Session.create({
      recipientId: new UniqueEntityId(recipientId),
      accessToken,
      expiresAt,
    })

    return right({
      session,
    })
  }
}
