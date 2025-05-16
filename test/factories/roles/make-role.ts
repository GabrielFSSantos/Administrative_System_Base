import { generatePermissionValueObject } from 'test/factories/roles/value-objects/make-permissions'
import { generateNameValueObject } from 'test/factories/value-objects/make-name'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/roles/entities/role'
import { PermissionName } from '@/domain/roles/entities/value-objects/permission-name'
import { Name } from '@/shared/value-objects/name'

export function makeRole(
  override: Partial<{
    recipientId: UniqueEntityId
    name: Name
    permissions: PermissionName[]
  }> = {},
  id?: UniqueEntityId,
): Role {
  const recipientId = override.recipientId ?? new UniqueEntityId()
  const name = override.name ?? generateNameValueObject()
  const permissions = override.permissions ?? [generatePermissionValueObject()]

  return Role.create(
    {
      recipientId,
      name,
      permissions,
    },
    id,
  )
}
