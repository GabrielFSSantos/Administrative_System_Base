import { PaginationParams } from '@/core/repositories/pagination-params'
import { User } from '@/domain/users/entities/user'

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findMany(parms: PaginationParams): Promise<User[]>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(user: User): Promise<void>
}
