import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Name } from '@/shared/value-objects/name'

import { RolePermissionList } from './role-permission-list'
import { PermissionName } from './value-objects/permission-name'

interface RoleProps {
  recipientId: UniqueEntityId
  name: Name
  permissions: RolePermissionList
}

export class Role extends Entity<RoleProps> {
  get recipientId(): UniqueEntityId {
    return this.props.recipientId
  }

  get name(): Name {
    return this.props.name
  }

  get permissionValues(): string[] {
    return this.props.permissions.getItems().map((p) => p.value)
  }

  public hasPermission(permissionName: PermissionName): boolean {
    return this.props.permissions.has(permissionName)
  }

  public updateName(name: Name): void {
    this.props.name = name
  }

  public updatePermissions(permissions: PermissionName[]): void {
    this.props.permissions.update(permissions)
  }

  static create(
    props: {
      recipientId: UniqueEntityId
      name: Name
      permissions: PermissionName[]
    },
    id?: UniqueEntityId,
  ): Role {
    const permissionList = new RolePermissionList(props.permissions)

    return new Role(
      {
        recipientId: props.recipientId,
        name: props.name,
        permissions: permissionList,
      },
      id,
    )
  }
}
