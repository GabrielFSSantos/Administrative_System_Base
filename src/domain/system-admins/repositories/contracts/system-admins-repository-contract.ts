import { SystemAdmin } from '@/domain/system-admins/entities/system-admin'
import { ActivatableRepository } from '@/shared/ActivationStatus/repositories/contracts/activatable-repository-contract'

import { IFetchManySystemAdminsUseCaseRequest } from '../../use-cases/contracts/fetch-many-system-admins-contract'

export abstract class SystemAdminsRepositoryContract implements ActivatableRepository<SystemAdmin> {
  abstract findById(id: string): Promise<SystemAdmin | null>
  abstract findByRecipientId(recipientId: string): Promise<SystemAdmin | null>
  abstract findMany(params: IFetchManySystemAdminsUseCaseRequest): Promise<{
    systemAdmins: SystemAdmin[]
    total: number
  }>
  abstract create(systemAdmin: SystemAdmin): Promise<void>
  abstract save(systemAdmin: SystemAdmin): Promise<void>
  abstract delete(id: string): Promise<void>
}
