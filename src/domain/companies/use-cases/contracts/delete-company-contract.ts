import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export interface IDeleteCompanyUseCaseRequest {
  companyId: string
}

export type IDeleteCompanyUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export abstract class DeleteCompanyContract {
  abstract execute(
    input: IDeleteCompanyUseCaseRequest
  ): Promise<IDeleteCompanyUseCaseResponse>
}
