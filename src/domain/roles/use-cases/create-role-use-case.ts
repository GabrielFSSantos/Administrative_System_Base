import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Role } from '../entities/role'
import { validateAndParsePermissions } from '../helpers/validate-and-parse-permissions-helper'
import { RolesRepositoryContract } from '../repositories/contracts/roles-repository-contract'
import {
  CreateRoleContract,
  ICreateRoleUseCaseRequest,
  ICreateRoleUseCaseResponse,
} from './contracts/create-role-contract'

@Injectable()
export class CreateRoleUseCase implements CreateRoleContract {
  constructor(
    private readonly rolesRepository: RolesRepositoryContract,
  ) {}

  async execute({
    recipientId,
    name,
    permissionValues,
  }: ICreateRoleUseCaseRequest): Promise<ICreateRoleUseCaseResponse> {

    const result = validateAndParsePermissions(permissionValues)
    
    if (result.isLeft()) {
      return left(result.value)
    }
        
    const permissions = result.value

    const role = Role.create({
      recipientId: new UniqueEntityId(recipientId),
      name,
      permissions,
    })

    await this.rolesRepository.create(role)

    return right({ 
      role,
    })
  }
}
