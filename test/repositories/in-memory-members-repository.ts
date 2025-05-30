import { Member } from '@/domain/members/entities/member'
import { MembersRepositoryContract } from '@/domain/members/repositories/contracts/members-repository-contract'
import { IFetchManyMembersUseCaseRequest } from '@/domain/members/use-cases/contracts/fetch-many-members-contract'

export class InMemoryMembersRepository implements MembersRepositoryContract {
  public items: Member[] = []

  async findById(id: string): Promise<Member | null> {
    const member = this.items.find((item) => item.id.toString() === id)

    return member ?? null
  }

  async findByRecipientAndCompanyId({
    recipientId,
    companyId,
  }: {
    recipientId: string
    companyId: string
  }): Promise<Member | null> {
    return (
      this.items.find(
        (item) =>
          item.recipientId.toString() === recipientId &&
          item.companyId.toString() === companyId,
      ) ?? null
    )
  }

  async findMany({
    page,
    pageSize,
    companyId,
    search,
  }: IFetchManyMembersUseCaseRequest): Promise<{ members: Member[]; total: number }> {
    let results = this.items

    if (companyId) {
      results = results.filter((item) => item.companyId.toString() === companyId)
    }

    if (search) {
      const term = search.toLowerCase()

      results = results.filter((item) =>
        item.id.toString().toLowerCase().includes(term), // ou outro campo que faça sentido
      )
    }

    const total = results.length
    const paginated = results.slice((page - 1) * pageSize, page * pageSize)

    return {
      members: paginated,
      total,
    }
  }

  async create(member: Member): Promise<void> {
    this.items.push(member)
  }

  async save(member: Member): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(member.id))

    if (index >= 0) {
      this.items[index] = member
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }
}
