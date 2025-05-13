import { Session } from '@/domain/sessions/entities/session'
import { SessionsRepositoryContract } from '@/domain/sessions/repositories/contracts/sessions-repository-contract'
import { IFetchManySessionsUseCaseRequest } from '@/domain/sessions/use-cases/contracts/fetch-many-sessions-contract'

export class InMemorySessionsRepository implements SessionsRepositoryContract {
  public items: Session[] = []
  
  async findByToken(accessToken: string): Promise<Session | null> {
    const session = this.items.find((session) => session.accessToken === accessToken)

    if (!session) return null

    return session
  }

  async findById(id: string): Promise<Session | null> {
    const session = this.items.find((session) => session.id.toString() === id)

    if (!session) return null

    return session
  }

  async findMany({
    page,
    pageSize,
    recipientId,
    onlyValid,
  }: IFetchManySessionsUseCaseRequest): Promise<Session[]> {
    let results = this.items

    if (recipientId) {
      results = results.filter(
        (session) => session.recipientId.toString() === recipientId,
      )
    }

    if (onlyValid) {
      results = results.filter((session) => session.isValid())
    }

    return results.slice((page - 1) * pageSize, page * pageSize)
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
    const itemIndex = this.items.findIndex((item) => item.id === session.id)

    this.items[itemIndex] = session
  }

  async deleteExpiredSessions(): Promise<void> {
    this.items = this.items.filter((session) => !session.isExpired())
  }
  
}
