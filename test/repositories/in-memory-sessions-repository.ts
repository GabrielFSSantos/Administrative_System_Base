import { Session } from '@/domain/sessions/entities/session'
import { SessionsRepository } from '@/domain/sessions/repositories/sessions-repository'

export class InMemorySessionsRepository implements SessionsRepository {
  public items: Session[] = []
  
  async findByToken(token: string): Promise<Session | null> {
    const session = this.items.find((session) => session.token === token)

    if (!session) return null

    return session
  }

  async create(session: Session): Promise<void> {
    this.items.push(session)
  }

  async save(session: Session): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === session.id)

    this.items[itemIndex] = session
  }

  async deleteExpiredSessions(): Promise<void> {
    // Implementar um serviço agendado no repositório
    throw new Error('Method not implemented.')
  }
}
