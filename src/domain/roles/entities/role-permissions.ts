import { WatchedList } from '@/core/entities/watched-list'

import { PermissionName } from './value-objects/permission-name'

export class RolePermissions extends WatchedList<PermissionName> {
  public compareItems(a: PermissionName, b: PermissionName): boolean {
    return a.value === b.value
  }

  public has(permission: PermissionName): boolean {
    return this.getItems().some((p) => p.equals(permission))
  }
}
