import { Session } from '@/domain/sessions/entities/session'
import { SessionsRepositoryContract } from '@/domain/sessions/repositories/contracts/sessions-repository-contract'
import { IFetchManySessionsUseCaseRequest } from '@/domain/sessions/use-cases/contracts/fetch-many-sessions-contract'

export class InMemorySessionsRepository implements SessionsRepositoryContract {
  public items: Session[] = []
  
  async findByToken(accessToken: string): Promise<Session | null> {
    const session = this.items.find((session) => session.accessToken.toString() === accessToken)

    return session ?? null
  }

  async findById(id: string): Promise<Session | null> {
    const session = this.items.find((session) => session.id.toString() === id)

    return session ?? null
  }

  async findMany({
    page,
    pageSize,
    recipientId,
    onlyValid,
  }: IFetchManySessionsUseCaseRequest): 
  Promise<{ sessions: Session[]; total: number }> {
    let results = this.items

    if (recipientId) {
      results = results.filter(
        (session) => session.recipientId.toString() === recipientId,
      )
    }

    if (onlyValid) {
      results = results.filter((session) => session.isValid())
    }

    const total = results.length
    const paginated = results.slice((page - 1) * pageSize, page * pageSize)

    return {
      sessions: paginated,
      total,
    }
  }

  async findLastByRecipientId(recipientId: string): Promise<Session | null> {
    const sessions = this.items
      .filter((session) => session.recipientId.toString() === recipientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return sessions[0] ?? null
  }

  async create(session: Session): Promise<void> {
    this.items.push(session)
  }

  async save(session: Session): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(session.id))

    if (itemIndex >= 0) {
      this.items[itemIndex] = session
    }
  }

  async deleteExpiredSessions(): Promise<void> {
    this.items = this.items.filter((session) => !session.isExpired())
  }
}
