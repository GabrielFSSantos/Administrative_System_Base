import { SystemAdmin } from '@/domain/system-admins/entities/system-admin'
import { IFetchManySystemAdminsUseCaseRequest } from '@/domain/system-admins/use-cases/contracts/fetch-many-system-admins-contract'
import { User } from '@/domain/users/entities/user'

import { InMemorySystemAdminsRepository } from './in-memory-system-admins-repository' 

export class InMemorySystemAdminsWithUsersRepository extends InMemorySystemAdminsRepository {
  constructor(
    private userMap: Map<string, User>, // recipientId → User
  ) {
    super()
  }

  override async findMany({
    page,
    pageSize,
    search,
  }: IFetchManySystemAdminsUseCaseRequest): Promise<{ systemAdmins: SystemAdmin[]; total: number }> {
    let results = this.items

    if (search) {
      const term = search.toLowerCase()

      results = results.filter((systemAdmin) => {
        const user = this.userMap.get(systemAdmin.recipientId.toString())

        return !!user && user.name.value.toLowerCase().includes(term)
      })
    }

    const total = results.length
    const paginated = results.slice((page - 1) * pageSize, page * pageSize)

    return {
      systemAdmins: paginated,
      total,
    }
  }
}
