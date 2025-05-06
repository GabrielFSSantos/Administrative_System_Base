import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { RolePermissions } from './role-permissions'
import { PermissionName } from './value-objects/permission-name'

interface RoleProps {
  name: string
  permissions: RolePermissions
}

export class Role extends Entity<RoleProps> {
  get name(): string {
    return this.props.name
  }

  get permissions(): ReadonlyArray<PermissionName> {
    return this.props.permissions.getItems()
  }

  public addPermission(permissionName: PermissionName): void {
    this.props.permissions.add(permissionName)
  }

  public removePermission(permissionName: PermissionName): void {
    this.props.permissions.remove(permissionName)
  }

  public hasPermission(permissionName: PermissionName): boolean {
    return this.props.permissions.has(permissionName)
  }

  static create(
    props: { name: string; permissions: PermissionName[] },
    id?: UniqueEntityId,
  ): Role {
    const permissions = new RolePermissions(props.permissions)

    return new Role({ name: props.name, permissions }, id)
  }
}
