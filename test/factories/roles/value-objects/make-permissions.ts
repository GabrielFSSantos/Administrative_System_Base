import { PermissionName } from '@/domain/roles/entities/value-objects/permission-name'
import { ALL_PERMISSIONS } from '@/shared/permissions'

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
