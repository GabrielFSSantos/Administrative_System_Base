import { generateAccessTokenValueObject } from 'test/fakes/sessions/value-objects/fake-generate-access-toke'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Session, SessionProps} from '@/domain/sessions/entities/session'

export function makeSession(
  override: Partial<SessionProps> = {},
  id?: UniqueEntityId,
) {
  const session = Session.create(
    {
      recipientId: new UniqueEntityId(),
      accessToken: generateAccessTokenValueObject(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      ...override,
    },
    id,
  )

  return session
}
