import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Session, SessionProps} from '@/domain/sessions/entities/session'

export function makeSession(
  override: Partial<SessionProps> = {},
  id?: UniqueEntityId,
) {
  const session = Session.create(
    {
      recipientId: new UniqueEntityId(),
      accessToken: faker.string.uuid(),
      expiresAt: faker.date.future(),
      ...override,
    },
    id,
  )

  return session
}
