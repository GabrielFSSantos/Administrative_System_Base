import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { InvalidRoleNameError } from './errors/invalid-role-name-error'
import { RolePermissionList } from './role-permission-list'
import { PermissionName } from './value-objects/permission-name'

interface RoleProps {
  recipientId: UniqueEntityId
  name: string
  permissions: RolePermissionList
}

export class Role extends Entity<RoleProps> {
  get recipientId(): UniqueEntityId {
    return this.props.recipientId
  }

  get name(): string {
    return this.props.name
  }

  get permissionValues(): string[] {
    return this.props.permissions.getItems().map((p) => p.value)
  }

  public hasPermission(permissionName: PermissionName): boolean {
    return this.props.permissions.has(permissionName)
  }

  public updateName(name: string): void {
    if (!Role.isValidName(name)) {
      throw new InvalidRoleNameError(name)
    }

    this.props.name = name
  }

  public updatePermissions(permissions: PermissionName[]): void {
    this.props.permissions.update(permissions)
  }

  static isValidName(name: string): boolean {
    return !!name && name.trim().length > 0
  }

  static create(
    props: { 
      recipientId: UniqueEntityId, 
      name: string; 
      permissions: PermissionName[] },
    id?: UniqueEntityId,
  ): Role {
    if (!Role.isValidName(props.name)) {
      throw new InvalidRoleNameError(props.name)
    }

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