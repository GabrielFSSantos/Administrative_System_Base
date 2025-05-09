import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { PermissionName } from '../entities/value-objects/permission-name'
import { RolesRepositoryContract } from '../repositories/contracts/roles-repository-contract'
import {
  EditRoleContract,
  IEditRoleUseCaseRequest,
  IEditRoleUseCaseResponse,
} from './contracts/edit-role-contract'
import { InvalidPermissionError } from './errors/invalid-permission-error'

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
      role.updateName(name)
    }

    if (permissionValues) {
      const invalidPermissions = permissionValues.filter(
        (value) => !PermissionName.verify(value),
      )

      if (invalidPermissions.length > 0) {
        return left(new InvalidPermissionError(invalidPermissions))
      }

      const permissionNames = permissionValues.map(PermissionName.parse)

      role.updatePermissions(permissionNames)
    }

    await this.rolesRepository.save(role)

    return right({ role })
  }
}
