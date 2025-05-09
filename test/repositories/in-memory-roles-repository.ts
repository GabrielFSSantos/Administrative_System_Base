import { Role } from '@/domain/roles/entities/role'
import { RolesRepositoryContract } from '@/domain/roles/repositories/contracts/roles-repository-contract'

export class InMemoryRolesRepository implements RolesRepositoryContract {
  public items: Role[] = []

  async findById(id: string): Promise<Role | null> {
    const role = this.items.find((item) => item.id.toString() === id)

    if (!role) {
      return null
    }

    return role
  }

  async create(role: Role): Promise<void> {
    this.items.push(role)
  }

  async save(role: Role): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(role.id))

    if (itemIndex >= 0) {
      this.items[itemIndex] = role
    }
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === id)

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
}
