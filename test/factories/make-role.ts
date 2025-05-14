import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/roles/entities/role'
import { PermissionName } from '@/domain/roles/entities/value-objects/permission-name'

export function makeRole(
  override: Partial<{ recipientId: UniqueEntityId; name: string; permissions: PermissionName[] }> = {},
  id?: UniqueEntityId,
): Role {
  const recipientId = override.recipientId ?? new UniqueEntityId()
  const name = override.name ?? 'Administrator'
  const permissions = override.permissions ?? [
    PermissionName.parse('create_user'),
    PermissionName.parse('edit_user'),
    PermissionName.parse('delete_user'),
    PermissionName.parse('view_user'),
    PermissionName.parse('create_session'),
    PermissionName.parse('revoke_session'),
  ]

  return Role.create(
    {
      recipientId,
      name,
      permissions,
    },
    id,
  )
}
