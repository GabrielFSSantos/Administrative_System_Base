import { Injectable } from '@nestjs/common'

import { right } from '@/core/either'

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
    const roles = await this.rolesRepository.findManyByRecipientId({
      recipientId,
      page,
      pageSize,
    })

    return right({ 
      roles,
    })
  }
}
