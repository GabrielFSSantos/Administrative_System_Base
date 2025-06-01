import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Member, MemberProps } from '@/domain/members/entities/member'

import { generateActivationStatusValueObject } from '../value-objects/make-activation-status'

export async function makeMember(
  override: Partial<MemberProps> = {},
  id?: UniqueEntityId,
): Promise<Member> {
  const recipientId = override.recipientId ?? UniqueEntityId.create()
  const ownerId = override.ownerId ?? UniqueEntityId.create()
  const profileId = override.profileId ?? UniqueEntityId.create()
  const activationStatus = override.activationStatus ?? generateActivationStatusValueObject(false)

  const member = Member.create(
    {
      recipientId,
      ownerId,
      profileId,
      activationStatus,
      ...override,
    },
    id,
  )

  return member
}
