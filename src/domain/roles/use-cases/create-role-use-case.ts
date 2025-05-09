import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'

import { Role } from '../entities/role'
import { PermissionName } from '../entities/value-objects/permission-name'
import { RolesRepositoryContract } from '../repositories/contracts/roles-repository-contract'
import {
  CreateRoleContract,
  ICreateRoleUseCaseRequest,
  ICreateRoleUseCaseResponse,
} from './contracts/create-role-contract'
import { InvalidPermissionError } from './errors/invalid-permission-error'

@Injectable()
export class CreateRoleUseCase implements CreateRoleContract {
  constructor(
    private readonly rolesRepository: RolesRepositoryContract,
  ) {}

  async execute({
    name,
    permissionValues,
  }: ICreateRoleUseCaseRequest): Promise<ICreateRoleUseCaseResponse> {

    const invalidPermissions = permissionValues.filter(
      (value) => !PermissionName.verify(value),
    )

    if (invalidPermissions.length > 0) {
      return left(new InvalidPermissionError(invalidPermissions))
    }

    const permissions = permissionValues.map(PermissionName.parse)

    const role = Role.create({
      name,
      permissions,
    })

    await this.rolesRepository.create(role)

    return right(null)
  }
}
