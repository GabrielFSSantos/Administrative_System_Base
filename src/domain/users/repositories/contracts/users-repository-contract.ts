import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/users/entities/user'

import { IFetchManyUsersUseCaseRequest } from '../../use-cases/contracts/fetch-many-users-contract'

export abstract class UsersRepositoryContract {
  abstract findById(id: string): Promise<User | null>
  abstract findByCpf(cpf: string): Promise<User | null> 
  abstract findByEmail(emailAddress: string): Promise<User | null>
  abstract findMany(parms: IFetchManyUsersUseCaseRequest): Promise<{ users: User[]; total: number }>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(id: UniqueEntityId): Promise<void>
}
