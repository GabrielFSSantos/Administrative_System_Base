import { Role } from '../../entities/role'

export abstract class RolesRepositoryContract {
  abstract findById(id: string): Promise<Role | null>
  abstract create(role: Role): Promise<void>
  abstract save(role: Role): Promise<void>
  abstract delete(id: string): Promise<void>
}
