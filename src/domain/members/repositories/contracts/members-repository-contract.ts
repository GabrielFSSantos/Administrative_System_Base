import { Member } from '@/domain/members/entities/member'
import { ActivatableRepository } from '@/shared/value-objects/ActivationStatus/repositories/contracts/activatable-repository-contract'

import { IFetchManyMembersUseCaseRequest } from '../../use-cases/contracts/fetch-many-members-contract'

export abstract class MembersRepositoryContract implements ActivatableRepository<Member> {
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
  abstract delete(id: string): Promise<void>
}
