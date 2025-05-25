import { generateAccessTokenValueObject } from 'test/factories/sessions/value-objects/make-access-token'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Session, SessionProps} from '@/domain/sessions/entities/session'

export function makeSession(
  override: Partial<SessionProps> = {},
  id?: UniqueEntityId,
) {
  
  const session = Session.create(
    {
      recipientId: UniqueEntityId.create(),
      accessToken: generateAccessTokenValueObject(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      ...override,
    },
    id,
  )

  if(session.isLeft()) {
    throw session.value
  }

  return session.value
}
