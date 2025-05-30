import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { Name } from '@/shared/value-objects/name'
import { validateAndParsePermissions } from '@/shared/watched-lists/permission-list/helpers/validate-and-parse-permissions-helper'

import { RolesRepositoryContract } from '../repositories/contracts/roles-repository-contract'
import {
  EditRoleContract,
  IEditRoleUseCaseRequest,
  IEditRoleUseCaseResponse,
} from './contracts/edit-role-contract'

@Injectable()
export class EditRoleUseCase implements EditRoleContract {
  constructor(
    private readonly rolesRepository: RolesRepositoryContract,
  ) {}

  async execute({
    roleId,
    name,
    permissionValues,
  }: IEditRoleUseCaseRequest): Promise<IEditRoleUseCaseResponse> {
    const role = await this.rolesRepository.findById(roleId)

    if (!role) {
      return left(new ResourceNotFoundError())
    }

    if (name) {
      const nameObject = Name.create(name)

      if(nameObject.isLeft()) {
        return left(nameObject.value)
      }

      role.updateName(nameObject.value)
    }

    if (permissionValues) {
      const result = validateAndParsePermissions(permissionValues)

      if (result.isLeft()) {
        return left(result.value)
      }
    
      const permissionNames = result.value

      role.updatePermissions(permissionNames)
    }

    await this.rolesRepository.save(role)

    return right({ role })
  }
}
