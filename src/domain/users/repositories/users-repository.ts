import { User } from '@/domain/users/entities/user'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UserSearchParams } from '../dtos/user-search-params'

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findMany(parms: UserSearchParams): Promise<User[]>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(id: UniqueEntityId): Promise<void>
}
