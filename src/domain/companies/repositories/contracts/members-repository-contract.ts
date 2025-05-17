import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Member } from '@/domain/companies/entities/member'

import { IFetchManyMembersUseCaseRequest } from '../../use-cases/contracts/fetch-many-members-contract'

export abstract class MembersRepositoryContract {
  abstract findById(id: string): Promise<Member | null>
  abstract findByRecipientAndCompanyId(params: {
    recipientId: string
    companyId: string
  }): Promise<Member | null>
  abstract findMany(params: IFetchManyMembersUseCaseRequest): Promise<{
    members: Member[]
    total: number
  }>
  abstract create(member: Member): Promise<void>
  abstract save(member: Member): Promise<void>
  abstract delete(id: UniqueEntityId): Promise<void>
}
