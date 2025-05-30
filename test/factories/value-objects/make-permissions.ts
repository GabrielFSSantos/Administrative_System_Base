import { ALL_PERMISSIONS } from '@/shared/permissions'
import { PermissionName } from '@/shared/value-objects/permission-name'
import { PermissionList } from '@/shared/watched-lists/PermissionList/permission-list'

export function generateValidPermission(): string {
  const index = Math.floor(Math.random() * ALL_PERMISSIONS.length)

  return ALL_PERMISSIONS[index]
}

export function generatePermissionValueObject(value?: string): PermissionName {
  const result = PermissionName.parse(value ?? generateValidPermission())

  if (result.isLeft()) {
    throw result.value
  }

  return result.value
}

export function generatePermissionList(count = 1): PermissionList {
  const permissions = Array.from({ length: count }, () => generatePermissionValueObject())

  return PermissionList.create(permissions)
}
