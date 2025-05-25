import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { RolesRepositoryContract } from '../repositories/contracts/roles-repository-contract'
import {
  GetRoleContract,
  IGetRoleUseCaseRequest,
  IGetRoleUseCaseResponse,
} from './contracts/get-role-contract'

@Injectable()
export class GetRoleUseCase implements GetRoleContract {
  constructor(
    private readonly rolesRepository: RolesRepositoryContract,
  ) {}

  async execute({
    roleId,
  }: IGetRoleUseCaseRequest): Promise<IGetRoleUseCaseResponse> {
    const role = await this.rolesRepository.findById(roleId)
    
    if (!role) {
      return left(new ResourceNotFoundError())
    }
    
    return right({
      role,
    })
    
  }
}
