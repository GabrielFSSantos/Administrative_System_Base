import { SystemAdmin } from '@/domain/users/entities/system-admin'
import { SystemAdminsRepositoryContract } from '@/domain/users/repositories/contracts/system-admins-repository-contract'
import { IFetchManySystemAdminsUseCaseRequest } from '@/domain/users/use-cases/contracts/fetch-many-system-admins-contract'

export class InMemorySystemAdminsRepository implements SystemAdminsRepositoryContract {
  public items: SystemAdmin[] = []

  async findById(id: string): Promise<SystemAdmin | null> {
    const systemAdmin = this.items.find((item) => item.id.toString() === id)

    return systemAdmin ?? null
  }

  async findByRecipientId(recipientId: string): Promise<SystemAdmin | null> {
    return (
      this.items.find(
        (item) => item.recipientId.toString() === recipientId,
      ) ?? null
    )
  }

  async findMany({
    page,
    pageSize,
    search,
  }: IFetchManySystemAdminsUseCaseRequest): Promise<{ systemAdmins: SystemAdmin[]; total: number }> {
    let results = this.items

    if (search) {
      const term = search.toLowerCase()

      results = results.filter((item) =>
        item.id.toString().toLowerCase().includes(term),
      )
    }

    const total = results.length
    const paginated = results.slice((page - 1) * pageSize, page * pageSize)

    return {
      systemAdmins: paginated,
      total,
    }
  }

  async create(systemAdmin: SystemAdmin): Promise<void> {
    this.items.push(systemAdmin)
  }

  async save(systemAdmin: SystemAdmin): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(systemAdmin.id))

    if (index >= 0) {
      this.items[index] = systemAdmin
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }
}
