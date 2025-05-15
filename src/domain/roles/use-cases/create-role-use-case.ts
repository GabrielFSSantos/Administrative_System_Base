import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Name } from '@/shared/value-objects/name'

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

    const nameObject = Name.create(name)

    if(nameObject.isLeft()) {
      return left(nameObject.value)
    }

    const result = validateAndParsePermissions(permissionValues)
    
    if (result.isLeft()) {
      return left(result.value)
    }
        
    const permissions = result.value

    const role = Role.create({
      recipientId: new UniqueEntityId(recipientId),
      name: nameObject.value,
      permissions,
    })

    await this.rolesRepository.create(role)

    return right({ 
      role,
    })
  }
}
