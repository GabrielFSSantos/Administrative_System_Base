import { User } from '@/domain/users/entities/user'
import { UsersRepositoryContract } from '@/domain/users/repositories/contracts/users-repository-contract'
import { IFetchManyUsersUseCaseRequest } from '@/domain/users/use-cases/contracts/fetch-many-users-contract'

export class InMemoryUsersRepository implements UsersRepositoryContract {
  public items: User[] = []

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = this.items.find((item) => item.cpf.value === cpf)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(emailAddress: string): Promise<User | null> {
    const user = this.items.find((item) => item.emailAddress.value === emailAddress)

    if (!user) {
      return null
    }

    return user
  }

  async findMany({ page, pageSize, search}: IFetchManyUsersUseCaseRequest): 
  Promise<{ users: User[]; total: number }> {
  
    let results = this.items
  
    if (search) {
      const term = search.toLowerCase()

      results = results.filter((user) =>
        user.name.value.toLowerCase().includes(term) ||
        user.emailAddress.value.toLowerCase().includes(term),
      )
    }

    const total = results.length

    const paginated = results.slice((page - 1) * pageSize, page * pageSize)

    return {
      users: paginated,
      total,
    }
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items[itemIndex] = user
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === id)

    this.items.splice(itemIndex, 1)
  }
}
