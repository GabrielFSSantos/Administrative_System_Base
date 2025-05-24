import { generateNameValueObject } from 'test/factories/value-objects/make-name'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/roles/entities/role'
import { PermissionList } from '@/shared/PermissionList/permission-list'
import { Name } from '@/shared/value-objects/name'

import { generatePermissionList } from '../value-objects/make-permissions'

export function makeRole(
  override: Partial<{
    recipientId: UniqueEntityId
    name: Name
    permissions: PermissionList
  }> = {},
  id?: UniqueEntityId,
): Role {
  const recipientId = override.recipientId ?? new UniqueEntityId()
  const name = override.name ?? generateNameValueObject()
  const permissions = override.permissions ?? generatePermissionList(1)

  return Role.create(
    {
      recipientId,
      name,
      permissions,
    },
    id,
  )
}
