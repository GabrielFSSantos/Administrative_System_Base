import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { RolePermissionList } from './role-permission-list'
import { PermissionName } from './value-objects/permission-name'

interface RoleProps {
  name: string
  permissions: RolePermissionList
}

export class Role extends Entity<RoleProps> {
  get name(): string {
    return this.props.name
  }

  public get permissionValues(): string[] {
    return this.props.permissions.getItems().map((p) => p.value)
  }

  public hasPermission(permissionName: PermissionName): boolean {
    return this.props.permissions.has(permissionName)
  }

  public updateName(name: string): void {
    this.props.name = name
  }

  public updatePermissions(permissions: PermissionName[]): void {
    this.props.permissions.update(permissions)
  }

  static create(
    props: { name: string; permissions: PermissionName[] },
    id?: UniqueEntityId,
  ): Role {
    const permissionList = new RolePermissionList(props.permissions)
  
    return new Role(
      { 
        name: props.name, 
        permissions: permissionList, 
      }, 
      id,
    )
  }
}