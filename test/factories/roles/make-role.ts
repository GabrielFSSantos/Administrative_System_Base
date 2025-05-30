import { generateNameValueObject } from 'test/factories/value-objects/make-name'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/roles/entities/role'
import { Name } from '@/shared/value-objects/name'
import { PermissionList } from '@/shared/watched-lists/permission-list/permission-list'

import { generatePermissionList } from '../value-objects/make-permissions'

export function makeRole(
  override: Partial<{
    recipientId: UniqueEntityId
    name: Name
    permissions: PermissionList
  }> = {},
  id?: UniqueEntityId,
): Role {
  const recipientId = override.recipientId ?? UniqueEntityId.create()
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
