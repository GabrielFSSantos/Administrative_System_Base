import { Session } from '../../entities/session'
import { IFetchManySessionsUseCaseRequest } from '../../use-cases/contracts/fetch-many-sessions-contract'

export abstract class SessionsRepositoryContract {
  abstract findByToken(token: string): Promise<Session | null>
  abstract findById(id: string): Promise<Session | null>
  abstract findMany(parms: IFetchManySessionsUseCaseRequest): Promise<Session[]>
  abstract findLastByRecipientId(recipientId: string): Promise<Session | null>
  abstract create(session: Session): Promise<void>
  abstract save(session: Session): Promise<void>
  abstract deleteExpiredSessions(): Promise<void>
}
