import { Member } from '@/domain/companies/entities/member'
import { IFetchManyMembersUseCaseRequest } from '@/domain/companies/use-cases/contracts/fetch-many-members-contract'
import { User } from '@/domain/users/entities/user'

import { InMemoryMembersRepository } from './in-memory-members-repository'

export class InMemoryMembersWithUsersRepository extends InMemoryMembersRepository {
  constructor(
    private userMap: Map<string, User>, // recipientId → User
  ) {
    super()
  }

  override async findMany({
    page,
    pageSize,
    companyId,
    search,
  }: IFetchManyMembersUseCaseRequest): Promise<{ members: Member[]; total: number }> {
    let results = this.items.filter((item) => item.companyId.toString() === companyId)

    if (search) {
      const term = search.toLowerCase()

      results = results.filter((member) => {
        const user = this.userMap.get(member.recipientId.toString())

        return !!user && user.name.value.toLowerCase().includes(term)
      })
    }

    const total = results.length
    const paginated = results.slice((page - 1) * pageSize, page * pageSize)

    return {
      members: paginated,
      total,
    }
  }
}
