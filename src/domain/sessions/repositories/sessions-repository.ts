import { Session } from '../entities/session'

export abstract class SessionsRepository {
  abstract findByToken(token: string): Promise<Session | null>
  abstract revoke(session: Session): Promise<void>
  abstract create(session: Session): Promise<void>
}
