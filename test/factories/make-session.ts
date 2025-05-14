import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Session, SessionProps} from '@/domain/sessions/entities/session'

export function makeSession(
  override: Partial<SessionProps> = {},
  id?: UniqueEntityId,
) {
  const session = Session.create(
    {
      recipientId: new UniqueEntityId(),
      accessToken: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      ...override,
    },
    id,
  )

  return session
}
