import { WatchedList } from '@/core/entities/watched-list'

import { PermissionName } from './value-objects/permission-name'

export class PermissionList extends WatchedList<PermissionName> {
  public compareItems(a: PermissionName, b: PermissionName): boolean {
    return a.equals(b)
  }

  public has(permission: PermissionName): boolean {
    return this.getItems().some((p) => p.equals(permission))
  }

  static create(initialItems?: PermissionName[]): PermissionList {
    return new PermissionList(initialItems)
  }
}
