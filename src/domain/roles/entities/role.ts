import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PermissionList } from '@/shared/PermissionList/permission-list'
import { PermissionName } from '@/shared/PermissionList/value-objects/permission-name'
import { Name } from '@/shared/value-objects/name'

interface RoleProps {
  recipientId: UniqueEntityId
  name: Name
  permissions: PermissionList
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

  public updateName(name: Name): void {
    this.props.name = name
  }

  public hasPermission(permissionName: PermissionName): boolean {
    return this.props.permissions.has(permissionName)
  }

  public updatePermissions(permissions: PermissionName[]): void {
    this.props.permissions.update(permissions)
  }

  static create(
    props: RoleProps,
    id?: UniqueEntityId,
  ): Role {
    const permissionList = props.permissions ?? new PermissionList()

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
