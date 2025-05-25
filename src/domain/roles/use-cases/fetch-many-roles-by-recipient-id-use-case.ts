import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { RolesRepositoryContract } from '../repositories/contracts/roles-repository-contract'
import {
  FetchManyRolesByRecipientIdContract,
  IFetchManyRolesByRecipientIdRequest,
  IFetchManyRolesByRecipientIdResponse,
} from './contracts/fetch-many-roles-by-recipient-id-contract'

@Injectable()
export class FetchManyRolesByRecipientIdUseCase
implements FetchManyRolesByRecipientIdContract
{
  constructor(
    private readonly rolesRepository: RolesRepositoryContract,
  ) {}

  async execute({
    recipientId,
    page,
    pageSize,
  }: IFetchManyRolesByRecipientIdRequest): Promise<IFetchManyRolesByRecipientIdResponse> {

    if (page < 1 || pageSize < 1) {
      return left(new InvalidPaginationParamsError())
    }
        
    const {roles, total} = await this.rolesRepository.findManyByRecipientId({
      recipientId,
      page,
      pageSize,
    })

    return right({ 
      roles,
      pagination: {
        page,
        pageSize,
        total,
      },
    })
  }
}
