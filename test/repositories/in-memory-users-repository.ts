import { UsersRepository } from '@/domain/users/repositories/users-repository'
import { User } from '@/domain/users/entities/user'
import { AccountsRepository } from '@/domain/sessions/repositories/accounts-repository'
import { UserSearchParams } from '@/domain/users/dtos/user-search-params'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class InMemoryUsersRepository implements UsersRepository, AccountsRepository {
  public items: User[] = []

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findMany({ page, pageSize, search, role, isActive }: UserSearchParams): Promise<User[]> {
  
    let results = this.items
  
    if (search) {
      const term = search.toLowerCase()
      results = results.filter((user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term),
      )
    }
  
    if (role) {
      results = results.filter((user) => user.role === role)
    }
  
    if (isActive) {
      results = results.filter((user) => user.isActive === isActive)
    }
    
    return results.slice((page - 1) * pageSize, page * pageSize)
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items[itemIndex] = user
  }

  async delete(id: UniqueEntityId): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(id))

    this.items.splice(itemIndex, 1)
  }
}
