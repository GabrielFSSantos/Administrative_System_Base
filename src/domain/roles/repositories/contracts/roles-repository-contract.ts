import { Role } from '../../entities/role'
import { IFetchManyRolesByRecipientIdRequest } from '../../use-cases/contracts/fetch-many-roles-by-recipient-id-contract'

export abstract class RolesRepositoryContract {
  abstract findById(id: string): Promise<Role | null>
  abstract findManyByRecipientId(parms: IFetchManyRolesByRecipientIdRequest): Promise<Role[]>
  abstract create(role: Role): Promise<void>
  abstract save(role: Role): Promise<void>
  abstract delete(id: string): Promise<void>
}
