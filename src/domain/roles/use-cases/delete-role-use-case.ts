import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { RolesRepositoryContract } from '../repositories/contracts/roles-repository-contract'
import {
  DeleteRoleContract,
  IDeleteRoleUseCaseRequest,
  IDeleteRoleUseCaseResponse,
} from './contracts/delete-role-contract'

@Injectable()
export class DeleteRoleUseCase implements DeleteRoleContract {
  constructor(
    private readonly rolesRepository: RolesRepositoryContract,
  ) {}

  async execute({
    roleId,
  }: IDeleteRoleUseCaseRequest): Promise<IDeleteRoleUseCaseResponse> {
    const role = await this.rolesRepository.findById(roleId)

    if (!role) {
      return left(new ResourceNotFoundError())
    }

    await this.rolesRepository.delete(roleId)

    return right(null)
  }
}
