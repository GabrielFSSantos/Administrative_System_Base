import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { Company } from '../../entities/company'

export interface IEditCompanyUseCaseRequest {
  companyId: string
  name?: string
  emailAddress?: string
  permissionValues?: string[]
}

export type IEditCompanyUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    company: Company
  }
>

export abstract class EditCompanyContract {
  abstract execute(
    input: IEditCompanyUseCaseRequest
  ): Promise<IEditCompanyUseCaseResponse>
}
