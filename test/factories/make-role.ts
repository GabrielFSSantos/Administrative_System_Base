import { generateNameValueObject } from 'test/fakes/users/value-objects/fake-generate-name'
import { generatePermissionValueObject } from 'test/fakes/users/value-objects/fake-generate-permissions.'

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
