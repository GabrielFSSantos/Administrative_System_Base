import { SessionsRepository } from '@/domain/sessions/repositories/sessions-repository'
import { Session } from '@/domain/sessions/entities/session'

export class InMemorySessionsRepository implements SessionsRepository {
  public items: Session[] = []

  async create(session: Session): Promise<void> {
    this.items.push(session)
  }
  
  async findByToken(token: string): Promise<Session | null> {
    const session = this.items.find((session) => session.token === token)

    if (!session) return null

    return session
  }

  async revoke(session: Session): Promise<void> {
    if (session) {
      session.revoke()
    }
  }

  async deleteExpiredSessions(): Promise<void> {
    // Implementar um serviço agendado no repositório
    throw new Error('Method not implemented.')
  }
}
