import { Session } from '../entities/session'

export abstract class SessionsRepository {
  abstract findByToken(token: string): Promise<Session | null>
  abstract create(session: Session): Promise<void>
  abstract save(session: Session): Promise<void>
  abstract deleteExpiredSessions(): Promise<void>
}
