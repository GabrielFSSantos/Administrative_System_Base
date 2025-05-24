import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { SystemAdmin, SystemAdminProps } from '@/domain/users/entities/system-admin'

import { generateActivationStatusValueObject } from '../value-objects/make-activation-status'

export async function makeSystemAdmin(
  override: Partial<SystemAdminProps> = {},
  id?: UniqueEntityId,
): Promise<SystemAdmin> {
  const recipientId = override.recipientId ?? UniqueEntityId.create()
  const profileId = override.profileId ?? UniqueEntityId.create()
  const activationStatus = override.activationStatus ?? generateActivationStatusValueObject(false)

  const systemAdmin = SystemAdmin.create(
    {
      recipientId,
      profileId,
      activationStatus,
      ...override,
    },
    id,
  )

  return systemAdmin
}
